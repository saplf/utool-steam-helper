const fs = require('fs');
const path = require('path');

const cache = {};

/**
 * 获取某文件路径，文件不存在会返回空串
 *
 * @param {string} key 缓存 key
 * @param {string} steamPath steam 应用路径
 * @param {string[]} paths 文件路径
 */
function getPathOf(key, steamPath, ...paths) {
  if (typeof cache[key] !== 'undefined') return cache[key];
  if (steamPath) {
    const result = path.resolve(steamPath, ...paths);
    cache[key] = fs.existsSync(result) ? result : '';
  } else {
    cache[key] = '';
  }
  return cache[key];
}

/**
 * 获取文件内容
 *
 * @param {import('fs').PathLike} path
 */
function getContentOf(path) {
  if (!fs.existsSync(path)) return '';
  return fs.readFileSync(path).toString();
}

module.exports = {
  getPathOf,
  getContentOf,
};
