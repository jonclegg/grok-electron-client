const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://grok.com') || url.startsWith('https://x.com')) {
      return { action: 'allow' };
    }
    return { action: 'deny' };
  });

  mainWindow.webContents.on('did-create-window', (childWindow) => {
    childWindow.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https://grok.com') || url.startsWith('https://x.com')) {
        mainWindow.loadURL(url);
        childWindow.close();
        return { action: 'deny' };
      }
      return { action: 'deny' };
    });
  });

  mainWindow.loadURL('https://grok.com');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});


