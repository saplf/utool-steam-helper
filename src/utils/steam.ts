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

  // const buffer = await window.getAppInfo();

  let apps: any = {};
  // todo: 由用户手动触发
  // if (buffer) {
  //   apps = await parseAppInfo(buffer);
  //   console.log(apps);
  // }

  return contents
    .map(parseVdf)
    .map((it) => it.AppState)
    .filter((it) => it && it.appid)
    .map((it) => ({
      ...it,
      ...window.getAppImages(it.appid),
      ...apps[it.appid],
    })) as Game.App[];
}
