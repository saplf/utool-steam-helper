const { getPathOf, getContentOf } = require('./service');

let serviceImpl = {};
if (utools.isWindows()) {
  serviceImpl = require('./service.win');
} else if (utools.isMacOs()) {
  serviceImpl = require('./service.mac');
}
const { getSteamAppPath } = serviceImpl;

/**
 * 获取登录用户路径
 */
window.getUserVdfPath = function () {
  return getPathOf('userVdf', getSteamAppPath?.(), 'config', 'loginusers.vdf');
};

/**
 * 获取应用信息路径
 */
window.getAppInfoPath = function () {
  return getPathOf('appInfo', getSteamAppPath?.(), 'appcache', 'appinfo.vdf');
};

/**
 * 获取库文件夹配置文件路径
 */
window.getLibraryFoldersPath = function () {
  return getPathOf(
    'libraryFolders',
    getSteamAppPath?.(),
    'config',
    'libraryfolders.vdf'
  );
};

/**
 * 获取用户信息
 */
window.getUserVdf = function () {
  return getContentOf(window.getUserVdfPath());
};

/**
 * 获取游戏库路径
 */
window.getLibraryFolders = function () {
  return getContentOf(window.getLibraryFoldersPath());
};

/**
 * 获取 steam 应用所在路径
 */
window.getSteamAppPath = serviceImpl.getSteamAppPath;
