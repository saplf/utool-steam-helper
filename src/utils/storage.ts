
/**
 * 从本地存储获取
 */
export function getStorage<T = any>(key: string): T | null {
  try {
    const str = utools.dbStorage.getItem(key);
    if (typeof str === 'undefined') return null
    return str;
  } catch (error) {
    return null;
  }
}

/**
 * 存储到本地
 */
export function setStorage(key: string, value: any) {
  utools.dbStorage.setItem(key, value);
}

export function removeStorage(key: string) {
  utools.dbStorage.removeItem(key);
}
