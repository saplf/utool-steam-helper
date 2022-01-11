const fs = require('fs');
const path = require('path');

const cache = {};

/**
 * 缓存并获取某文件路径，文件不存在会返回空串
 *
 * @param {string} key 缓存 key
 * @param {import('fs').PathLike[]} paths 文件路径
 */
function getPathOf(key, ...paths) {
  if (typeof cache[key] !== 'undefined') return cache[key];
  const result = path.resolve(...paths);
  cache[key] = fs.existsSync(result) ? result : '';
  return cache[key];
}

/**
 * 获取文件内容
 *
 * @param {import('fs').PathLike} path
 * @param {BufferEncoding} encoding
 */
function getContentOf(path, encoding = 'utf-8') {
  if (!fs.existsSync(path)) return Promise.resolve('');
  return new Promise((resolve) => {
    fs.readFile(path, { encoding }, (err, data) => {
      resolve(err ? '' : data);
    });
  });
}

/**
 * 获取文件二进制流
 *
 * @param {import('fs').PathLike} path
 *
 * @returns {Promise<Uint8Array | undefined>}
 */
function getBinaryContentOf(path) {
  if (!fs.existsSync(path)) return Promise.resolve(undefined);
  return new Promise((resolve) => {
    fs.readFile(path, (err, data) => {
      resolve(err ? undefined : data);
    });
  });
}

module.exports = {
  getPathOf,
  getContentOf,
  getBinaryContentOf,
};
