const { app, BrowserWindow, Tray, Menu, ipcMain, nativeTheme } = require('electron');
const path = require('path');
const fs = require('fs');


let mainWindow;

const isDev = !app.isPackaged;

let iconPath
function setAppIcon() {
    const isDarkMode = nativeTheme.shouldUseDarkColors
    if (isDarkMode) {
        iconPath = isDev
            ? path.join(__dirname, '../assets/ubookdesktop-light.png') // for dev
            : path.join(process.resourcesPath, './assets/ubookdesktop-light.png'); // for prod

    } else {
        iconPath = isDev
            ? path.join(__dirname, '../assets/ubookdesktop.png') // for dev
            : path.join(process.resourcesPath, './assets/ubookdesktop.png'); // for prod

    }
}

setAppIcon()

app.disableHardwareAcceleration()

ipcMain.handle('get-picowave-path', () => {
    const picoPath = isDev ? path.join(__dirname, '../common/pico_bundle/bin/pico2wave')
        : path.join(process.resourcesPath, 'common/pico_bundle/bin/pico2wave');
    return picoPath;
});

//Handle Documentation shortcut
ipcMain.handle('show-documentation', () => {
    const _docWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    isDev
        ? _docWindow.loadFile(path.join(__dirname, '../assets/documentation.html'))
        : _docWindow.loadFile(path.join(process.resourcesPath, './assets/documentation.html'));
});

const template = [
    {
        label: 'File',
        submenu: [
            { label: 'New', accelerator: 'CmdOrCtrl+N', click: () => console.log('New File') },
            { label: 'Open', accelerator: 'CmdOrCtrl+O', click: () => console.log('Open File') },
            { type: 'separator' },
            { label: 'Exit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
            { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
            { type: 'separator' },
            { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
            { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
            { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
            { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' }
        ]
    },
    {
        label: 'View',
        submenu: [
            { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: (item, focusedWindow) => focusedWindow.reload() },
            { label: 'Toggle Developer Tools', accelerator: 'F12', click: (item, focusedWindow) => focusedWindow.webContents.toggleDevTools() },
            { type: 'separator' },
            { label: 'Zoom In', accelerator: 'CmdOrCtrl+=', click: (item, focusedWindow) => focusedWindow.webContents.send('zoom-in') },
            { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', click: (item, focusedWindow) => focusedWindow.webContents.send('zoom-out') }
        ]
    },
    {
        label: 'Window',
        submenu: [
            { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
            { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
            {
                label: 'Toggle Full Screen',
                role: 'togglefullscreen',       // built-in behavior
                accelerator: 'F11'              // explicit on all platforms
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            { label: 'Learn More', click: () => require('electron').shell.openExternal('https://electronjs.org') },
            {
                label: 'Documentation',
                click: () => {
                    const docWindow = new BrowserWindow({
                        width: 800,
                        height: 600,
                        webPreferences: {
                            preload: path.join(__dirname, 'preload.js'),
                            nodeIntegration: false,
                            contextIsolation: true
                        }
                    });
                    show_documentation()
                }
            }
        ]
    }
];

function show_documentation() {
    const _docWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    isDev
        ? _docWindow.loadFile(path.join(__dirname, '../assets/documentation.html'))
        : _docWindow.loadFile(path.join(process.resourcesPath, './assets/documentation.html'));
}

// Function to create the loading and main windows
function createWindow() {
    // Create the loading window
    const loadingWindow = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        alwaysOnTop: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false, // Disable remote module if not needed
        }
    });

    loadingWindow.loadFile(path.join(__dirname, '../assets/loading.html'));
    loadingWindow.show(); // Show the loading window immediately

    // Create the main window
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: iconPath, // Path to your icon file
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Use the preload script
            nodeIntegration: false, // Enable Node.js integration in the renderer process
            contextIsolation: true,
            sandbox: false, // Disable sandboxing
        }
    });

    mainWindow = win

    // Load the main application when it is ready
    if (isDev) {
        win.loadURL('http://localhost:30001/')
        // Open DevTools in development
        //mainWindow.webContents.openDevTools()
    } else {
        isDev
            ? win.loadFile(path.join(__dirname, '../build/index.html'))
            : win.loadFile(path.join(process.resourcesPath, './build/index.html'))
    }

    // Use 'did-finish-load' or 'dom-ready' for reliability
    win.webContents.once('did-finish-load', () => {
        //console.log('did-finish-load fired (show main window)');
        win.show();

        // Prefer destroy over close for the splash
        if (!loadingWindow.isDestroyed()) {
            loadingWindow.destroy();
        }
    });

    // Intercept the window close event
    win.on('close', (event) => {
        if (!app.isQuiting && process.platform !== 'darwin') {
            event.preventDefault();   // prevent window from actually closing
            win.hide();        // just hide it to tray
        }
        return false;
    });

    // Return the main window for reference
    return win;
}

// Set the app user model ID
app.setAppUserModelId('com.ubookdesktop.app');

app.on('ready', async () => {

    await prepDirectories(); // if it's an async function
    await prepNoteFile();
    await prepBookmarkFile();
    await prepFavouriteFile();

    // Create and set the menu
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    // Create the main window
    const mainWindow = createWindow();

    // Create the tray icon
    const tray = new Tray(iconPath); // Path to your tray icon
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show',
            click: () => {
                const windows = BrowserWindow.getAllWindows();
                if (windows.length === 0) {
                    createWindow();
                } else {
                    windows[0].show();
                }
            }
        },
        {
            label: 'New window',
            click: () => {
                createWindow()
            }
        },
        {
            label: 'Help',
            click: () => {
                show_documentation()
            }
        },
        {
            label: 'Quit',
            click: () => {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('UBookDesktop');
    tray.setContextMenu(contextMenu);

    // Restore window on tray double-click
    tray.on('double-click', () => {
        mainWindow.show();
    });
});

app.on('window-all-closed', (event) => {
    event.preventDefault(); // ✅ don’t quit app when all windows closed
    /*if (process.platform !== 'darwin') {
        app.quit(); // Quit when all windows are closed, except on macOS
    }*/
});

// Handle window close properly - ONLY if mainWindow exists
if (mainWindow) {
    mainWindow.on('close', (event) => {
        try {
            if (process.platform !== 'darwin') {
                // On Windows/Linux, hide instead of close
                event.preventDefault();
                mainWindow.hide();
            }
            // On macOS, let the close happen normally

            // Remove references to prevent memory leaks
            mainWindow.removeAllListeners();
        } catch (err) { }
    });
}

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow(); // Recreate a window if none are open on macOS
    }
});


async function prepDirectories() {
    try {
        const baseDir = path.join(app.getPath('home'), '.UBookDesk');

        // Create the base .quickai directory if it doesn't exist
        fs.mkdirSync(baseDir, { recursive: true });
        console.log(`Ensured base directory: ${baseDir}`);

        // Define subdirectories to be created inside .quickai
        const subdirs = ['.saveNotes', '.favourites', '.bookmark', '.cache'];

        subdirs.forEach(sub => {
            const fullPath = path.join(baseDir, sub);
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`Ensured subdirectory: ${fullPath}`);
        });
    } catch (error) {
        console.log(error)
    }
}
async function prepNoteFile() {
    const file = path.join(app.getPath('home'), '.UBookDesk', '.saveNotes', 'notes.json');

    const structure = {
        notes: []
    };

    try {
        // Check if file exists asynchronously
        await fs.promises.access(file, fs.constants.F_OK);
        // File exists
        return true;
    } catch (err) {
        // File does not exist, create directory and file
        console.log(`Prep notes file: ${file}`);

        // Ensure directory exists
        //await fs.promises.mkdir(path.dirname(file), { recursive: true });

        // Write initial structure
        await fs.promises.writeFile(file, JSON.stringify(structure, null, 2), 'utf8');

        return true; // or true if you want to indicate success after creation
    }
}

async function prepFavouriteFile() {
    const file = path.join(app.getPath('home'), '.UBookDesk', '.favourites', 'fav.json');

    const structure = {
        "fav": []
    };
    try {
        // Check if file exists asynchronously
        await fs.promises.access(file, fs.constants.F_OK);
        // File exists
        return true;
    } catch (err) {
        // File does not exist, create directory and file
        console.log(`Prep favourites file ${file}`);

        // Ensure directory exists
        //await fs.promises.mkdir(path.dirname(file), { recursive: true });

        // Write initial structure
        await fs.promises.writeFile(file, JSON.stringify(structure, null, 2), 'utf8');

        return true; // or true if you want to indicate success after creation
    }
}

async function prepBookmarkFile() {
    const file = path.join(app.getPath('home'), '.UBookDesk', '.bookmark', 'bookmark.json');

    const structure = {
        "bookmark": []
    };
    try {
        // Check if file exists asynchronously
        await fs.promises.access(file, fs.constants.F_OK);
        // File exists→
        return true;
    } catch (err) {
        // File does not exist, create directory and file
        console.log(`Prep bookmark file ${file}`);

        // Ensure directory exists
        //await fs.promises.mkdir(path.dirname(file), { recursive: true });

        // Write initial structure
        await fs.promises.writeFile(file, JSON.stringify(structure, null, 2), 'utf8');

        return true; // or true if you want to indicate success after creation
    }
}

// IPC handler for keys reset
ipcMain.handle('get-app-version', async (event, accounts) => {
    try {
        return app.getVersion()
    } catch (err) {
        //console.log(err)
    }
});

ipcMain.handle('get-dev-status', async (event) => {
    return isDev
})

// Listen for theme change events from renderer
ipcMain.on('theme-changed', (event, isDarkMode) => {
    if (isDarkMode) {
        iconPath = isDev
            ? path.join(__dirname, '../assets/ubookdesktop-light.png') // for dev
            : path.join(process.resourcesPath, './assets/ubookdesktop-light.png'); // for prod

    } else {
        iconPath = isDev
            ? path.join(__dirname, '../assets/ubookdesktop.png') // for dev
            : path.join(process.resourcesPath, './assets/ubookdesktop.png'); // for prod

    }
})


nativeTheme.on('updated', () => {
    setAppIcon()
})
