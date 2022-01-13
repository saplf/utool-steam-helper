import { parse } from '@node-steam/vdf';
import { parseAppInfo } from './cypto';

const numberReg = /^\d+$/;

export function parseVdf(text: string) {
  try {
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
  // 获取多个 steam 库所在目录
  const result = parseVdf(await window.getLibraryFolders());
  const pans: any[] = Object.entries(result?.libraryfolders ?? {})
    .filter(([key]) => numberReg.test(key))
    .map(([_, value]) => value);
  if (!pans.length) return [];

  // 简单的 app 信息
  const simples: any[] = pans.flatMap(({ apps, path }) =>
    Object.entries(apps ?? {}).map(([appid]) => ({ appid, path }))
  );

  // 解析对应 app 的 acf 文件内的信息
  const contents = await Promise.all(
    simples.map((v) => window.getAppAcf(v.path, v.appid))
  );

  let apps: any = {};
  // todo: 由用户手动触发
  const buffer = await window.getAppInfo();
  if (buffer) {
    apps = await parseAppInfo(buffer);
  }

  return contents
    .map(parseVdf)
    .map((it, i) => ({ ...it.AppState, panPath: simples[i]?.path }))
    .filter((it) => it && it.appid)
    .map((it) => ({
      ...it,
      ...window.getAppImages(it.appid),
      ...apps[it.appid],
    }))
    .map(refactorAppInfo) as Game.App[];
}
