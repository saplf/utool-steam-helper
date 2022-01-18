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
 * @typedef {Object} Ret
 * @property {number} mtime
 * @property {string} content
 * @property {boolean} modified
 *
 * 获取文件内容，如果传入 lastModified，且文件未更改，则 content 为空
 *
 * @param {import('fs').PathLike} path
 * @param {number=} lastModified
 * @param {BufferEncoding} encoding
 *
 * @returns {Promise<Ret?>}
 */
function getContentOf(path, lastModified, encoding = 'utf-8') {
  if (!fs.existsSync(path)) return Promise.resolve(null);
  return new Promise((resolve) => {
    const stat = fs.statSync(path);
    const mtime = +stat.mtime;
    if (mtime === lastModified) {
      resolve({ mtime, modified: false });
      return;
    }

    fs.readFile(path, { encoding }, (err, content) => {
      if (err) {
        resolve(null);
      } else {
        resolve({ content, mtime, modified: true });
      }
    });
  });
}

/**
 * @typedef {Object} Ret
 * @property {number} mtime
 * @property {Uint8Array} content
 * @property {boolean} modified
 *
 * 获取文件二进制流
 *
 * @param {import('fs').PathLike} path
 * @param {number=} lastModified
 *
 * @returns {Promise<Ret?>}
 */
function getBinaryContentOf(path, lastModified) {
  if (!fs.existsSync(path)) return Promise.resolve(null);
  return new Promise((resolve) => {
    const stat = fs.statSync(path);
    const mtime = +stat.mtime;
    if (mtime === lastModified) {
      resolve({ mtime, modified: false });
      return;
    }

    fs.readFile(path, (err, content) => {
      if (err) {
        resolve(null);
      } else {
        resolve({ content, mtime, modified: true });
      }
    });
  });
}

module.exports = {
  getPathOf,
  getContentOf,
  getBinaryContentOf,
};
