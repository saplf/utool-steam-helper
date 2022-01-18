import { parse } from '@node-steam/vdf';
import { parseAppInfo } from './decode';
import { mapValues, promiseObject } from './helper';
import { getStorage, setStorage } from './storage';

const numberReg = /^\d+$/;
const APPS_KEY = 'apps_key';
const MTIME_KEY = 'modified_time_key';

const mtimeKey = {
  get libFolder() {
    return 'libFolder';
  },

  get appInfo() {
    return 'appConfig';
  },

  appAcf(appId: number | string) {
    return `${appId}_acf`;
  },
};

const isUndefined = (v: any) => typeof v === 'undefined';

export function parseVdf(text?: string) {
  try {
    if (!text) return null;
    return parse(text);
  } catch (error) {
    return null;
  }
}

const steamLauncherReg = /^steam:\/\/.+$/;

function matchOS(steamOsString: string) {
  return (
    (steamOsString === 'windows' && utools.isWindows()) ||
    (steamOsString === 'linux' && utools.isLinux()) ||
    (steamOsString === 'macos' && utools.isMacOs())
  );
}

function refactorAppInfo(app: any): any {
  const {
    appinfo: { common, config: { installdir, launch } = {} as any } = {} as any,
    appinfo,
    panPath,
    ...others
  } = app;
  const binary: any[] =
    Object.values(launch ?? {}).filter(
      (it: any) => !it.config || matchOS(it.config.oslist)
    ) || [];

  return {
    ...others,
    appinfo,
    panPath,
    launch: binary.map((it) => {
      const { executable } = it;
      if (steamLauncherReg.test(executable)) return executable;
      return window.resolvePath(
        panPath,
        'steamapps',
        'common',
        installdir,
        executable
      );
    }),
  };
}

/**
 * 获取游戏列表
 */
export async function getAppList() {
  const mtimeStore = getStorage<Game.Mtime>(MTIME_KEY) || {};

  // 获取多个 steam 库所在目录
  let appCache = getStorage<Record<string, Game.App>>(APPS_KEY) || {};
  const libContent = await window.getLibraryFolders(
    mtimeStore[mtimeKey.libFolder]
  );
  if (!libContent) return [];
  // 简单的 app 信息
  type BriefType = { appid: number; disk: string; brief?: boolean };
  let brief: Record<string, BriefType> = appCache;
  // 库更改了
  if (libContent.modified) {
    mtimeStore[mtimeKey.libFolder] = libContent.mtime;
    const result = parseVdf(libContent.content);
    const pans: any[] = Object.entries(result?.libraryfolders ?? {})
      .filter(([key]) => numberReg.test(key))
      .map(([_, value]) => value);
    brief = pans.reduce((prev, { apps, path }) => {
      Object.keys(apps ?? {}).forEach((key) => {
        prev[key] = appCache[key] ?? { appid: key, disk: path, brief: true };
      });
      return prev;
    }, {});
  }
  if (!Object.keys(brief).length) return [];

  // 解析对应 app 的 acf 文件内的信息
  const contents = await promiseObject(brief, (v) =>
    window.getAppAcf(
      v.disk,
      v.appid,
      v.brief ? undefined : mtimeStore[mtimeKey.appAcf(v.appid)]
    )
  );

  // 从 appInfo 加载数据
  let apps: any = appCache;
  const buffer = await window.getAppInfo(mtimeStore[mtimeKey.appInfo]);
  if (buffer && buffer.modified) {
    apps = (await parseAppInfo(buffer.content)) || {};
  }

  mapValues(contents, v => {
    
  });

  // return contents
  //   .map(parseVdf)
  //   .map((it, i) => ({ ...it.AppState, disk: brief[i]?.path }))
  //   .filter((it) => it && it.appid)
  //   .map((it) => ({
  //     ...it,
  //     ...window.getAppImages(it.appid),
  //     ...apps[it.appid],
  //   }))
  //   .map(refactorAppInfo) as Game.App[];
}
