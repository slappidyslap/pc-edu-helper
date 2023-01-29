import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import { join, resolve } from 'path';
import { configure, configureDatalist } from './configurer';
import getMenuTemplate from './menuTemplate';

// get environment type
const isDevelopment = process.env.NODE_ENV !== 'production';
let window;
// open a window
const openWindow = () => {
  window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // Это какой-то костыль, portable версия не запускается иначе
  if (isDevelopment) window.setIcon(join(__dirname, '..', 'static', 'icon.ico'));
  window.setTitle("pc edu helper")
  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate(window)))
  if (isDevelopment) window.webContents.openDevTools();
  window.maximize()

  // load HTML file
  if (isDevelopment)
    window.loadURL(`http://${process.env.ELECTRON_WEBPACK_WDS_HOST}:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  else
    window.loadFile(resolve(__dirname, 'index.html'));
};

ipcMain.on('new-datalist', (evt, data) => {
  console.log(data);
  configureDatalist(data);
})

// when app is ready, open a window
app.on('ready', () => {
  openWindow()
  configure(window);
});

// when all windows are closed, quit the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    ipcMain.removeAllListeners();
    app.quit();
  }
});

app.on('web-contents-created', (createEvent, contents) => {
  contents.on('new-window', event => {
    event.preventDefault();
  });
})

// when app activates, open a window
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    openWindow();
  }
});