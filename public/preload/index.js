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

window.getSteamAppPath = getSteamAppPath;

/**
 * 获取某 steam library path 下某 appid 的 acf 内容
 */
window.getAppAcf = function (libraryPath, appid) {
  return getContentOf(
    getPathOf(
      `acf_${appid}`,
      libraryPath,
      'steamapps',
      `appmanifest_${appid}.acf`
    )
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
window.getUserVdf = function () {
  return getContentOf(
    getPathOf('userVdf', getSteamAppPath(), 'config', 'loginusers.vdf')
  );
};

/**
 * 获取本地应用信息
 */
window.getAppInfo = function () {
  return getBinaryContentOf(
    getPathOf('appInfo', getSteamAppPath(), 'appcache', 'appinfo.vdf')
  );
};

/**
 * 获取游戏库路径
 */
window.getLibraryFolders = function () {
  return getContentOf(
    getPathOf(
      'libraryFolders',
      getSteamAppPath(),
      'config',
      'libraryfolders.vdf'
    )
  );
};

/**
 * 获取 steam 应用所在路径
 */
window.getSteamAppPath = serviceImpl.getSteamAppPath;
