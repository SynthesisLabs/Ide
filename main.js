const { app, BrowserWindow, Menu, dialog, ipcMain, screen } = require('electron');
const path = require('node:path')
const fs = require('fs')
const os = require('os')

let win;
let temp = os.tmpdir();
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'icon.ico'),
  });
  win.loadFile('index.html');
  win.maximize()
}


ipcMain.handle('dialog:openFile', async () => {
    openFile();
});
async function openFile(){
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt', 'js', 'html', 'css'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!canceled && filePaths.length > 0) {
    const filePath = filePaths[0];
    const fileName = path.basename(filePath); // Get only the file name
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Send the file name and content to the renderer
    win.webContents.send('file-opened', { fileName, fileContent });
  }
}
  function newFile(){
    const file_name = 'new_file.txt';
    const filepath = path.join(temp,file_name)

    win = new BrowserWindow({
      width: 1200,
      height: 1000,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      },
      icon: path.join(__dirname, 'icon.ico'),
    });
    win.loadFile(file_name);
    win.maximize()
}

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open...',
        click: async (item, focusedWindow) => {
          if (focusedWindow) {
            const { filePath, content } = focusedWindow.webContents.executeJavaScript('ipcRenderer.invoke("dialog:openFile")');
            if (filePath) {
              focusedWindow.webContents.send('open-file', { filePath, content });
            }
          }
        },

      },
      {
        label: 'New window',
        click: ()=>{
          createWindow()
        }
      },
      {
        type: 'separator',
      },
      {
        label: 'new file',
        click:()=>{

        }
      }
      ,
      {
        label: 'Reload',
        role: "forceReload",
        accelerator: 'CmdOrCtrl+R',
      },
      {
        label: 'Exit',
        role: 'quit',
      }
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Zoom In',
        accelerator: 'CmdOrCtrl+=',  // Changed to CmdOrCtrl+=
        click: () => {
          const currentZoom = win.webContents.getZoomLevel();
          win.webContents.setZoomLevel(currentZoom + 1);  // Increase zoom level by 1
        },
      },
      {
        label: 'Zoom Out',
        accelerator: 'CmdOrCtrl+-',
        click: () => {
          const currentZoom = win.webContents.getZoomLevel();
          win.webContents.setZoomLevel(currentZoom - 1);  // Decrease zoom level by 1
        },
      },
      {
        label: 'Reset Zoom',
        accelerator: 'CmdOrCtrl+0',
        click: () => {
          win.webContents.setZoomLevel(0);  // Reset zoom level
        },
      },
    ],
  }

];

const customMenu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(customMenu);

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
