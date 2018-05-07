const electron = require('electron');
// Module to control application life.
const {app, Menu, ipcMain} = require('electron');
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const {download} = require('electron-dl');

const path = require('path');
const url = require('url');
const os = require('os');
var fs = require('fs');

if (!fs.existsSync(`${os.homedir()}/RebelCricketAdmin`)){
  fs.mkdirSync(`${os.homedir()}/RebelCricketAdmin`);
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const template = [
  {
    label: app.getName(),
    submenu: [
      {
        label: 'Login',
        click() {mainWindow.webContents.send('viewMenu', '/auth');}
      },
      // {
      //   label: 'Preferences',
      //   click () {openPreferencesWindow();}
      // },
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {
        label: 'Show Dev Tools',
        click() {mainWindow.webContents.openDevTools()}
      },
      {type: 'separator'},
      {role: 'quit'}
    ]
  },
  {
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Dashboard',
        click() {mainWindow.webContents.send('viewMenu', '/dashboard');}
      },
      {
        label: 'Orders',
        click() {mainWindow.webContents.send('viewMenu', '/dashboard/orders');}
      },
      {
        label: 'New Order',
        click() {mainWindow.webContents.send('viewMenu', '/dashboard/order/new');}
      },
      {
        label: 'Upload Files',
        click() {mainWindow.webContents.send('viewMenu', '/upload');}
      },
      {
        label: 'All Uploads',
        click() {mainWindow.webContents.send('viewMenu', '/dashboard/uploads');}
      },
      {
        label: 'Vendor Goods',
        click() {mainWindow.webContents.send('viewMenu', '/vendor_goods');}
      },
      {
        label: 'Vendor Goods Import',
        click() {mainWindow.webContents.send('viewMenu', '/dashboard/vendor_goods_import');}
      },
      {
        label: 'Settings',
        click() {mainWindow.webContents.send('viewMenu', '/dashboard/settings');}
      }
    ]
  }
  // ,{
  //   label: 'Search',
  //   role: 'help',
  //   submenu: []
  // }
]

const menu = Menu.buildFromTemplate(template)


let preferencesWindow = null;

function openPreferencesWindow() {
  if (preferencesWindow) {
   preferencesWindow.focus()
   return;
  }

  preferencesWindow = new BrowserWindow({
    height: 250,
    resizable: true,
    width: 450,
    title: "Preferences",
    minimizable: false,
    fullscreenable: false
  });

  preferencesWindow.loadURL(url.format({
    pathname: path.join(app.getAppPath(), 'electron/preferences.html'),
    protocol: 'file:',
    slashes: true
  }))
  // .loadURL('file://' + app.getAppPath() + 'electron/preferences.html');

  preferencesWindow.on('closed', function () {
    preferencesWindow = null;
  });
}

function createWindow () {

  Menu.setApplicationMenu(menu)

  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: width, 
    height: height, 
    frame: true, 
    title: "Rebel Cricket ADMIN", 
    autoHideMenuBar: true
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(app.getAppPath(), 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  ipcMain.on("download", (event, url) => {
    download(BrowserWindow.getFocusedWindow(), url, {openFolderWhenDone: true, directory: `${os.homedir()}/RebelCricketAdmin`})
      .then(dl => {
        // window.webContents.send("download complete", dl.getSavePath())
        // console.log("download complete, path:", dl.getSavePath());
      })
      .catch(console.error);
  });

  ipcMain.on("syncUpload", (event, url) => {
    download(BrowserWindow.getFocusedWindow(), url, {directory: `${os.homedir()}/RebelCricketAdmin`})
      .then(dl => {
        // window.webContents.send("download complete", dl.getSavePath())
        
      })
      .catch(console.error);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
