import { match } from 'pinyin-pro';
import { getStorage, setStorage } from './storage';

const CURRENT_USER_ID = 'current user id';
let currentFriendId: string | null | undefined = undefined;

export async function promiseObject<T = unknown, R = any>(
  obj: Record<string, T>,
  map: (v: T) => Promise<R>
): Promise<Record<string, R>> {
  const keys = Object.keys(obj);
  const ret = await Promise.all(keys.map((it) => map(obj[it])));

  return ret.reduce<Record<string, R>>((prev, cur, index) => {
    prev[keys[index]] = cur;
    return prev;
  }, {});
}

export function mapValues<T = unknown, R = any>(
  obj: Record<string, T>,
  map: (v: T, key: string) => R
) {
  const keys = Object.keys(obj ?? {});
  if (!keys.length) return {};

  return keys.reduce<Record<string, R>>((prev, cur, index) => {
    prev[keys[index]] = map(obj[cur], keys[index]);
    return prev;
  }, {});
}

export function filterNonnullValues<T = unknown>(
  obj: Record<string, T | null>,
  filter?: (v: T) => boolean
): Record<string, T> {
  const keys = Object.keys(obj);

  return keys.reduce<Record<string, T>>((prev, cur, index) => {
    const target = obj[cur];
    if (target && (!filter || filter(target))) {
      prev[keys[index]] = target;
    }
    return prev;
  }, {});
}

/**
 * 是否不使用缓存
 * todo 根据版本判断
 */
export function invalidCache() {
  return false;
}

/**
 * 从解析的 vdf 中获取对应路径的值（会忽略 path 首字母的大小）
 */
export function getValue(
  src: any,
  paths: string[],
  defaultValue = undefined
): any {
  let ret: any = src;
  for (let p of paths) {
    let v = ret?.[p];
    if (typeof v === 'undefined') {
      const [first, ...rest] = p;
      const code = first.charCodeAt(0);
      if (code < 65 || (code > 90 && code < 97) || code > 122) {
        return defaultValue;
      }
      v = ret?.[`${String.fromCharCode(code ^ 32)}${rest.join('')}`];
    }
    ret = v;
  }

  if (typeof ret === 'undefined') return defaultValue;
  return ret;
}

/**
 * 获取本地化的游戏名称
 */
export function getGameName(game: Game.App): string {
  const name = game.name;
  return name.schinese || name.english;
}

/**
 * 获取本地化的游戏标签
 */
export function getGameTags(game: Game.App): string[] {
  const tags = game.storeTags;
  return tags.schinese || tags.english;
}

/**
 * 获取已登录的用户 friend id
 */
export async function getCurrentFriendId(): Promise<string | null> {
  if (typeof currentFriendId !== 'undefined') return currentFriendId;
  const stored = getStorage(CURRENT_USER_ID);
  if (stored) {
    currentFriendId = stored;
  } else {
    const ids = await window.getLoggedFriendId();
    currentFriendId = ids?.[0] ?? null;
  }
  return currentFriendId;
}

/**
 * 设置当前使用的用户 friend id
 */
export function setCurrentFriendId(id: string) {
  currentFriendId = id;
  setStorage(CURRENT_USER_ID, id);
}

/**
 * 获取游玩时间
 */
export function getPlayTime(game: Game.App) {
  if (!game.record) return '';
  const { playtime } = game.record!;
  if (typeof playtime !== 'number') return '';
  if (playtime < 60) return `${playtime}分钟`;
  return `${+Math.round(playtime / 60).toFixed(1)}小时`;
}

/**
 * 根据规则/筛选排序列表
 */
export function orderGameList(
  apps?: Record<string, Game.App>,
  option?: { query?: string }
): Game.App[] {
  if (!apps) return [];
  let { query } = option || {};
  query = query?.toLocaleLowerCase();
  let list = Object.values(apps);
  if (query) {
    list = list.filter(({ name }) => {
      const { english, schinese, tchinese } = name;
      if (english && english.toLowerCase().includes(query)) return true;
      if (schinese && match(schinese, query)) return true;
      if (tchinese && match(tchinese, query)) return true;
      return false;
    });
  }
  list = list.sort((a, b) => {
    const { playtime: aTime } = a.record || {};
    const { playtime: bTime } = b.record || {};
    if (typeof aTime !== 'number') return 1;
    if (typeof bTime !== 'number') return -1;
    return bTime - aTime;
  });

  return list;
}
