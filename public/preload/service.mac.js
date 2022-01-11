const path = require('path');

function getSteamAppPath() {
  return path.resolve(utools.getPath('appData'), 'Steam');
}

module.exports = {
  getSteamAppPath,
};
