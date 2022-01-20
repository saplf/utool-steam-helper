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
  if (playtime < 60) return `已游玩${playtime}分钟`;
  return `已游玩${+Math.round(playtime / 60).toFixed(1)}小时`;
}
