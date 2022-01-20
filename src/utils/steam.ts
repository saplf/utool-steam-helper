import { parse } from '@node-steam/vdf';
import { parseAppInfo, parseBinaryData as parseBinaryData } from './decode';
import {
  filterNonnullValues,
  getCurrentFriendId,
  getValue,
  mapValues,
  promiseObject,
} from './helper';
import { getStorage, removeStorage, setStorage } from './storage';

const numberReg = /^\d+$/;
const APPS_KEY = 'apps_key';
const MTIME_KEY = 'modified_time_key';
const LOCALIZATION_KEY = 'localization_key';
const getCurUserKey = (id: string) => `user_${id}_key`;
const steamLauncherReg = /^steam:\/\/.+$/;

const mtimeKey = {
  get libFolder() {
    return 'libFolder';
  },

  get appInfo() {
    return 'appConfig';
  },

  get localization() {
    return 'localization';
  },

  appAcf(appId: number | string) {
    return `${appId}_acf`;
  },

  user(friendId: string) {
    return `${friendId}_user`;
  },
};

function parseVdf(text?: string) {
  try {
    if (!text) return null;
    return parse(text);
  } catch (error) {
    console.error(error);
    return null;
  }
}

function matchOS(steamOsString: string) {
  return (
    (steamOsString === 'windows' && utools.isWindows()) ||
    (steamOsString === 'linux' && utools.isLinux()) ||
    (steamOsString === 'macos' && utools.isMacOs())
  );
}

/**
 * 获取 tag info
 */
async function getTagInfo(mtimeStore: Game.Mtime) {
  let local = getStorage(LOCALIZATION_KEY);
  const info = await window.getLocalization(
    local ? mtimeStore[mtimeKey.localization] : undefined
  );
  if (info.modified) {
    mtimeStore[mtimeKey.localization] = info.mtime;
    local = parseVdf(info.content)?.localization;
    setStorage(LOCALIZATION_KEY, local);
  }
  return local;
}

/**
 * 获取用户信息
 */
async function getUserInfo(mtimeStore: Game.Mtime): Promise<Game.Usage | null> {
  const id = await getCurrentFriendId();
  const key = getCurUserKey(id);
  let local = getStorage(key);
  const info = await window.getLoggedUserInfo(
    id,
    local ? mtimeStore[mtimeKey.user(id)] : undefined
  );
  if (!info) return null;
  if (info.modified) {
    mtimeStore[mtimeKey.user(id)] = info.mtime;
    local = parseVdf(info.content)?.UserLocalConfigStore;
    if (!local) return local;

    const friends = getValue(local, ['friends'], {});
    const apps = getValue(local, ['software', 'valve', 'steam', 'apps']);
    local = {
      apps: mapValues(apps, (it: any) => ({
        lastPlayed: it.LastPlayed,
        playtime: it.Playtime,
      })),
      id,
      user: friends[id],
    };
    setStorage(key, local);
  }
  return local;
}

/**
 * 重新组合获取到的 appinfo
 */
function refactorAppInfo(app?: any, localization?: any): Game.App {
  if (!app) return app;
  const {
    appinfo: {
      common: {
        type,
        name_localized,
        store_tags,
        workshop_visible,
      } = {} as any,
      config: { installdir, launch } = {} as any,
    } = {} as any,
    appinfo,
    disk,
  } = app;

  let override: any = {
    name: { ...name_localized, english: app.name },
  };
  if (appinfo) {
    const binary: any[] =
      Object.values(launch ?? {}).filter(
        (it: any) => !it.config || matchOS(it.config.oslist)
      ) || [];
    override = {
      ...override,
      type,
      supportWorkshop: workshop_visible == 1,
      storeTags: mapValues(localization, (v: any) => {
        return store_tags?.map((id: number) => v.store_tags?.[id]) || [];
      }),
      launch: binary.map((it) => {
        const { executable } = it;
        if (steamLauncherReg.test(executable)) return executable;
        return window.resolvePath(
          disk,
          'steamapps',
          'common',
          installdir,
          executable
        );
      }),
    };
  }

  return { ...app, ...override };
}

/**
 * 获取游戏列表
 */
export async function getAppMap(
  mtimeStore: Game.Mtime
): Promise<Record<string, Game.App>> {
  // 获取多个 steam 库所在目录
  const appCache = getStorage<Record<string, Game.App>>(APPS_KEY) || {};
  const libContent = await window.getLibraryFolders(
    mtimeStore[mtimeKey.libFolder]
  );
  if (!libContent) return {};
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
    if (!Object.keys(brief).length) return {};
  }

  // 解析对应 app 的 acf 文件内的信息
  const contents = await promiseObject(brief, (v) =>
    window.getAppAcf(
      v.disk,
      v.appid,
      v.brief ? undefined : mtimeStore[mtimeKey.appAcf(v.appid)]
    )
  );

  // 从 appInfo 加载数据
  let apps: any = {};
  const buffer = await window.getAppInfo(mtimeStore[mtimeKey.appInfo]);
  if (buffer && buffer.modified) {
    mtimeStore[mtimeKey.appInfo] = buffer.mtime;
    apps = (await parseAppInfo(buffer.content)) || {};
  }

  const localizations = await getTagInfo(mtimeStore);
  const appMap = mapValues(contents, (v, k) => {
    if (!v) return null;
    let origin: any;
    if (v.modified) {
      mtimeStore[mtimeKey.appAcf(k)] = v.mtime;
      origin = {
        disk: brief[k]?.disk,
        ...parseVdf(v.content)?.AppState,
        ...window.getAppImages(k),
        ...apps[k],
      };
    }
    return {
      ...appCache[k],
      ...refactorAppInfo(origin, localizations),
    } as Game.App;
  });

  const result = filterNonnullValues(
    appMap,
    (it) => typeof it.appid !== 'undefined'
  );

  setStorage(APPS_KEY, result);
  return result;
}

export async function getAppList() {
  const mtimeStore = getStorage<Game.Mtime>(MTIME_KEY) || {};
  // const mtimeStore: Game.Mtime = {};
  const user = await getUserInfo(mtimeStore);
  const app = mapValues(await getAppMap(mtimeStore), (it) => ({
    ...it,
    record: user?.apps?.[it.appid],
  }));
  setStorage(MTIME_KEY, mtimeStore);

  console.log(user, app);
  return Object.values(app);
}

/**
 * 成就相关
 */
export async function getAppStats(appid: number) {
  const schema = await window.getUserGameStatsSchema(appid);
  const result = parseBinaryData(schema.content)?.[appid];
  console.log(result);
  return result;
}
