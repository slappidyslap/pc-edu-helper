import { app, BrowserWindow } from 'electron';
import path from 'path';

// get environment type
const isDevelopment = process.env.NODE_ENV !== 'production';

// open a window
const openWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // Это какой-то костыль, portable версия не запускается иначе
  if (isDevelopment) win.setIcon(path.join(__dirname, '..', 'static', 'icon.ico')); 
  win.setTitle("PC EDU Helper")
  win.maximize()
  win.removeMenu()
  if (isDevelopment) win.webContents.openDevTools();

  // load HTML file
  if (isDevelopment) {
    win.loadURL(`http://${process.env.ELECTRON_WEBPACK_WDS_HOST}:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    win.loadFile(path.resolve(__dirname, 'index.html'));
  }
};

// when app is ready, open a window
app.on('ready', () => {
  if (!process.env.PC_EDU_HELPER_API_URL)
    process.env.PC_EDU_HELPER_API_URL = 'https://render-spring-demo.onrender.com'
  openWindow();
});

// when all windows are closed, quit the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// when app activates, open a window
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    openWindow();
  }
});