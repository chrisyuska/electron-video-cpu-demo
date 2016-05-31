'use strict';

const {app, Menu, Tray, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const usage = require('pidusage');
const os = require('os');

let mainWindow;
let appIcon;
let pid;
let numCPUs;
let usages = [];

function createAppWindow () {
  var hideAfter = process.argv.indexOf('hide-after') >= 0;
  var showImmediately = process.argv.indexOf('show') >= 0;

  if (hideAfter) {
    console.log('Starting application and then hiding');
  } else {
    console.log('Starting application hidden');
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: hideAfter || showImmediately,
    autoHideMenuBar: true
  });

  // Watch for pid information being sent from mainWindow and start tracking
  // cpu usage for process
  ipcMain.on('set-pid', function(ev, newPid) {
    pid = newPid;

    console.log('Calculating average CPU usage...');
    setInterval(getCPUUsage, 1000);
  });

  // Load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // if hide-after argument was passed to application, hide main window now
  if (hideAfter) mainWindow.hide();

  // Get number of CPUs/cores for calculating total memory usage
  numCPUs = os.cpus().length;

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

// Get information on process usage and log current cpu usage
function getCPUUsage() {
  usage.stat(pid, function(err, stat) {
    if (err) console.log(err);

    console.log('Average CPU usage: ' + average(stat.cpu) + '%');
  });
}

// Calculate new running average and return rounded result
function average(newUsage) {
  if (newUsage) {
    usages.push(newUsage / numCPUs)
    // limit average to last 20 recordings
    usages = usages.slice(-20);
  }

  var sum = 0;
  for (var i = 0; i < usages.length; i++) {
    sum += usages[i];
  }

  // return resulting average rounded to hundredths place
  return Math.round(sum * 100 / usages.length) / 100;
}

// Initialize system tray for showing/hiding main window and quiting
function initializeTray() {
  appIcon = new Tray(path.join(__dirname, '/assets/Icon_Video.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Application Window',
      type: 'normal',
      enabled: !mainWindow || !mainWindow.isVisible(),
      click: function() {
        console.log('Showing application window');
        usages = [];
        mainWindow.show();
      }
    },
    { label: 'Hide Application Window',
      type: 'normal',
      enabled: mainWindow && mainWindow.isVisible(),
      click: function() {
        console.log('Hiding application window');
        usages = [];
        mainWindow.hide();
      }
    },
    { type: 'separator' },
    { label: 'Quit',
      click: function() {
        console.log('Quiting application');
        app.quit();
      }
    }
  ]);
  appIcon.setToolTip('Electron Video CPU Demo');
  appIcon.setContextMenu(contextMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
  initializeTray();
  createAppWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createAppWindow();
  }
});
