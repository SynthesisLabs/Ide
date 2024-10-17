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
    icon: path.join(__dirname, './icons/', 'icon.ico'),
  });
  win.loadFile('index.html');
  win.maximize()
}

ipcMain.handle('dialog:openFile', async () => {
  openFile();
});

ipcMain.handle('dialog:openFolder', async () => {
  openFolder();
});

async function openFile() {
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

async function openFolder() {
  const { filePaths, canceled } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })

  let folderName;

  if (!canceled && filePaths.length > 0) {
    const folderName = path.basename(filePaths[0]);
    const folderFolders = fs.readdirSync(filePaths[0])
    console.log(`${folderName}\n` + folderFolders)
  }

}

function newFile() {
  console.log("Swen is een snoepje")
  const fileName = 'new_file.txt';
  const filePath = path.join(temp, fileName)
  const fileContent = "New file";
  try {
    fs.writeFileSync(filePath, fileContent);
  } catch (err) {
    console.error(`Error writing file: ${err}`);
  }
  try {
    win.webContents.send('file-opened', { fileName, fileContent });

  } catch (err) {
    console.log(`Error opening the file: ${err}`)
  }
}

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open file',
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
        label: 'Open folder',
        click: async (item, focusedWindow) => {
          if (focusedWindow) {
            await focusedWindow.webContents.executeJavaScript('ipcRenderer.invoke("dialog:openFolder")');
          }
        },
      },
      {
        label: 'New window',
        click: () => {
          createWindow()
        }
      },
      {
        type: 'separator',
      },
      {
        label: 'new file',
        click: () => {
          newFile();
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

module.exports = newFile;