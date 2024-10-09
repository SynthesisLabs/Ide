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
                        label: "Open file",
                        click: () => {
                            console.log('Open file clicked');
                        },
                    },
                    {
                        label: "Open folder",
                        click: () => {
                            console.log('Open folder clicked');
                        },
                    },
                ],
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
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                role: 'forceReload',
            },
        ],
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                click: () => {
                    console.log('Undo pressed');
                },
                role: 'Undo',
            },
            {
                label: 'Redo',
                accelerator: 'CmdOrCtrl+Y',
                click: () => {
                    console.log('Redo pressed');
                },
                role: 'Redo',
            },
            {
                label: 'Cut',
                accelerator: "CmdOrCtrl+X",
                click: ()=>{
                    console.log('cut pressed')
                }
            },
            {
                label: 'Copy',
                accelerator: "CmdOrCtrl+V",
                click: ()=>{
                    console.log('coppy pressed')
                }
            },
            {
                label: 'Find',
                accelerator: "CmdOrCtrl+F",
                click: ()=>{
                    console.log('Find pressed')
                }
            },
            {
                label: 'Replace',
                accelerator: "CmdOrCtrl+H",
                click: ()=>{
                    console.log('Replace pressed')
                }
            }
        ],
    },
];
/* function Undo(){
    let history = [];
    let currentIndex = -1;

    //get the textarea

    // Track changes in the text area
    textArea.addEventListener('input', (e) => {
    history = history.slice(0, currentIndex + 1); // Remove forward history if any
    history.push(textArea.value);
    currentIndex++;
    });

    document.getElementById('undoButton').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        textArea.value = history[currentIndex];
    }
    });
}*/

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
