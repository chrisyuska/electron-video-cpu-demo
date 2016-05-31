'use strict';

const {ipcRenderer} = require('electron');

ipcRenderer.send('set-pid', process.pid);
