const { app, BrowserWindow, Menu } = require('electron');
const path = require('node:path')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
        icon: path.join(__dirname, 'icon.ico'),
    });
    win.loadFile('index.html');
}

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New File',
                accelerator: 'CmdOrCtrl+N',
                click: () => {
                    console.log('New File clicked');
                },
            },
            {
                label: 'Open...',
                submenu: [
                    {
                        label: "Open file"
                    },
                    {
                        label: "Open folder"
                    }
                ],
                // accelerator: 'CmdOrCtrl+O',
                click: () => {
                    console.log('Open clicked');
                },
            },
            {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click: () => {
                    console.log('Save clicked');
                },
            },
            {
                type: 'separator', 
            },
            {
                label: 'Exit',
                role: 'quit', 
            },
        ],
    },
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
