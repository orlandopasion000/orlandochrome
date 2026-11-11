const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('desktopApp', {
  isNativeApp: true,
  platform: process.platform,
  version: '5.0.0'
});
