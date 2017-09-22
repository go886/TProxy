const path = require('path')
const packager = require('electron-packager')
const buildConfig = require('./build.config')




function bundleApp() {
  packager(buildConfig, (err, appPaths) => {
    if (err) {

    } else {
    }
  })
}


bundleApp();