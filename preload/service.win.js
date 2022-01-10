const cp = require('child_process');

const REG_STEAM_64 = 'HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\Valve\\Steam';
const REG_STEAM_32 = 'HKEY_LOCAL_MACHINE\\SOFTWARE\\Valve\\Steam';
const REG_INSTALL = /InstallPath\s+REG_SZ\s+(.+)/;

let appPathCache;

function getPathByShell(cmd) {
  try {
    const result = cp.execSync(cmd, { windowsHide: true }).toString();
    return result.match(REG_INSTALL)?.[1] || '';
  } catch (error) {
    if (utools.isDev()) {
      console.warn(error);
    }
    return '';
  }
}

function getSteamAppPath() {
  const cmd = 'REG QUERY';
  if (appPathCache) return appPathCache;
  appPathCache =
    getPathByShell(`${cmd} ${REG_STEAM_64}`) ||
    getPathByShell(`${cmd} ${REG_STEAM_32}`);
  return appPathCache;
}

module.exports = {
  getSteamAppPath,
};
