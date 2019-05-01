const bs = require('browser-sync');
const bsInstance = bs.create('rollup-svelte');
const addLoc = /\s*?add_location\(.*\)\;?\s*?/gmi;

let scriptCache = {};

function noSvelteLocs(content) {
  return content.replace(addLoc, '');
}

function scriptChanged(filename, content) {
  return content !== scriptCache[filename];
}

function browsersync(options) {
  if (!bsInstance.active) {
    bsInstance.init(options || { server: '.' });
  }

  return {
    name: 'browsersync',
    generateBundle: function({}, bundle, isWrite) {
      for (const name of Object.keys(bundle)) {
        const bundleItem = bundle[name];
        if (isWrite && !bundleItem.isAsset) {
          const code = noSvelteLocs(bundleItem.code);
          if (scriptChanged(bundleItem.fileName, code)) {
            bsInstance.reload(bundleItem.dest);
            scriptCache[bundleItem.fileName] = code;
          }
        }
      }
    }
  };
}

module.exports = {
  bsInstance,
  browsersync
};
