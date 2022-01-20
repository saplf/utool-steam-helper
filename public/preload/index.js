const path = require('path');
const fs = require('fs');
const { getPathOf, getContentOf, getBinaryContentOf } = require('./service');

let serviceImpl = {};
if (utools.isWindows()) {
  serviceImpl = require('./service.win');
} else if (utools.isMacOs()) {
  serviceImpl = require('./service.mac');
}
const { getSteamAppPath: getSteamAppPathImpl } = serviceImpl;

const imageMap = [
  { key: 'icon', pattern: '{0}_icon.jpg' },
  { key: 'logo', pattern: '{0}_logo.png' },
  { key: 'heroBlur', pattern: '{0}_library_hero_blur.jpg' },
  { key: 'hero', pattern: '{0}_library_hero.jpg' },
  { key: 'library', pattern: '{0}_library_600x900.jpg' },
  { key: 'header', pattern: '{0}_header.jpg' },
];

function getSteamAppPath() {
  return getSteamAppPathImpl?.() ?? '';
}

/**
 * 提供正确解析文件路径的方法
 */
window.resolvePath = function (...paths) {
  return path.resolve(...paths);
};

/**
 * steam 安装路径
 */
window.getSteamAppPath = getSteamAppPath;

/**
 * 获取某 steam library path 下某 appid 的 acf 内容
 */
window.getAppAcf = function (libraryPath, appid, mtime) {
  return getContentOf(
    getPathOf(
      `acf_${appid}`,
      libraryPath,
      'steamapps',
      `appmanifest_${appid}.acf`
    ),
    mtime
  );
};

/**
 * 获取某个应用的图片信息
 */
window.getAppImages = function (appid) {
  return imageMap
    .map(({ key, pattern }) => ({
      key,
      path: getPathOf(
        `${appid}_${key}_image`,
        getSteamAppPath(),
        'appcache',
        'librarycache',
        pattern.replace('{0}', appid)
      ),
    }))
    .reduce((p, c) => ({ ...p, [c.key]: c.path }), {});
};

/**
 * 获取用户信息
 */
window.getUserVdf = function (mtime) {
  return getContentOf(
    getPathOf('userVdf', getSteamAppPath(), 'config', 'loginusers.vdf'),
    mtime
  );
};

/**
 * 获取登录过的用户 friend id
 */
window.getLoggedFriendId = function (mtime) {
  const userDir = getPathOf('userDir', getSteamAppPath(), 'userdata');
  if (!userDir) return Promise.resolve([]);
  return new Promise((resolve) => {
    fs.readdir(userDir, (err, files) => {
      resolve(
        err
          ? []
          : files.filter((it) =>
              fs.statSync(path.resolve(userDir, it)).isDirectory()
            )
      );
    });
  });
};

/**
 * 根据 friend id 获取详细的信息
 */
window.getLoggedUserInfo = function (friendId, mtime) {
  return getContentOf(
    getPathOf(
      `${friendId}_logged_userInfo`,
      getSteamAppPath(),
      'userdata',
      `${friendId}`,
      'config',
      'localconfig.vdf'
    ),
    mtime
  );
};

/**
 * 获取本地应用信息
 */
window.getAppInfo = function (mtime) {
  return getBinaryContentOf(
    getPathOf('appInfo', getSteamAppPath(), 'appcache', 'appinfo.vdf'),
    mtime
  );
};

/**
 * 获取本地应用信息
 */
window.getLocalization = function (mtime) {
  return getContentOf(
    getPathOf(
      'localization',
      getSteamAppPath(),
      'appcache',
      'localization.vdf'
    ),
    mtime
  );
};

/**
 * 获取应用的成就信息
 */
window.getUserGameStatsSchema = function (appid, mtime) {
  return getBinaryContentOf(
    getPathOf(
      `${appid}_stats_schema`,
      getSteamAppPath(),
      'appcache',
      'stats',
      `UserGameStatsSchema_${appid}.bin`
    ),
    mtime
  );
};

/**
 * 获取用户的成就信息
 */
window.getUserGameStats = function (friendId, appid, mtime) {
  return getBinaryContentOf(
    getPathOf(
      `${appid}_stats`,
      getSteamAppPath(),
      'appcache',
      'stats',
      `UserGameStats_${friendId}_${appid}.bin`
    ),
    mtime
  );
};

/**
 * 获取游戏库路径
 */
window.getLibraryFolders = function (mtime) {
  return getContentOf(
    getPathOf(
      'libraryFolders',
      getSteamAppPath(),
      'config',
      'libraryfolders.vdf'
    ),
    mtime
  );
};

/**
 * 获取 steam 应用所在路径
 */
window.getSteamAppPath = serviceImpl.getSteamAppPath;
