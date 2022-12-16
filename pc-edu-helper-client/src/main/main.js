import { app, BrowserWindow } from 'electron';
import { join, resolve } from 'path';
import { homedir } from 'os'
import { readFileSync, writeFileSync, existsSync } from 'fs';

// get environment type
const isDevelopment = process.env.NODE_ENV !== 'production';
const DEFAULT_API_URL = 'https://pc-edu-helper-api.onrender.com';

// open a window
const openWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // Это какой-то костыль, portable версия не запускается иначе
  if (isDevelopment) win.setIcon(join(__dirname, '..', 'static', 'icon.ico'));
  win.setTitle("PC EDU Helper")
  win.removeMenu()
  if (isDevelopment) win.webContents.openDevTools();
  /* win.maximize() */

  // load HTML file
  if (isDevelopment) {
    win.loadURL(`http://${process.env.ELECTRON_WEBPACK_WDS_HOST}:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    win.loadFile(resolve(__dirname, 'index.html'));
  }
};

const configure = () => {
  const configFile = join(homedir(), '.pceduhelper')
  if (!existsSync(configFile))
    writeFileSync(configFile, DEFAULT_API_URL)
  const API_URL = readFileSync(configFile);
  process.env['API_URL'] = API_URL;
}

// when app is ready, open a window
app.on('ready', () => {
  configure();
  openWindow();
});

// when all windows are closed, quit the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
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