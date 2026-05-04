import { app, BrowserWindow, globalShortcut, Tray, Menu, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import fs from 'fs';

const isDev = !app.isPackaged;
let mainWindow: Electron.BrowserWindow | null = null;

let isQuiting: boolean = false
let iconPath: string

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
function createWindow(): BrowserWindow {
    // Create the loading window
    const loadingWindow = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        alwaysOnTop: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            // enableRemoteModule: false, // Disable remote module if not needed
        }
    });

    loadingWindow.loadFile(path.join(__dirname, '../assets/loading.html'));
    loadingWindow.show(); // Show the loading window immediately

    // Create the main window
    mainWindow = new BrowserWindow({
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

    // Load the main application when it is ready
    if (isDev) {
        mainWindow.loadURL('http://localhost:30001/')
        // Open DevTools in development
        //mainWindow.webContents.openDevTools()
    } else {
        isDev
            ? mainWindow.loadFile(path.join(__dirname, '../build/index.html'))
            : mainWindow.loadFile(path.join(process.resourcesPath, './build/index.html'))
    }


    // Use 'did-finish-load' or 'dom-ready' for reliability
    mainWindow.webContents.once('did-finish-load', () => {
        //console.log('did-finish-load fired (show main window)');
        mainWindow?.show();

        // Prefer destroy over close for the splash
        if (!loadingWindow.isDestroyed()) {
            loadingWindow.destroy();
        }
    });

    // Intercept the window close event
    mainWindow.on('close', (event) => {
        if (!isQuiting && process.platform !== 'darwin') {
            event.preventDefault();   // prevent window from actually closing
            mainWindow?.hide();        // just hide it to tray
        }
        return false;
    });

    // Return the main window for reference
    return mainWindow;
}

const setShortcuts = () => {
    // F12 — Toggle DevTools
    globalShortcut.register('F12', () => {
        const win = BrowserWindow.getFocusedWindow();
        console.log("DEV TOOLS ..")
        if (win) {
            win.webContents.toggleDevTools();
        }
    });

    // F11 — Toggle Fullscreen
    // globalShortcut.register('F11', () => {
    //     const win = BrowserWindow.getFocusedWindow();
    //     if (win) {
    //         win.setFullScreen(!win.isFullScreen());
    //     }
    // });

    // Ctrl+R / Cmd+R — Reload
    globalShortcut.register('CommandOrControl+R', () => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) {
            win.webContents.reload();
        }
    });

    // Ctrl+Shift+R / Cmd+Shift+R — Force reload
    globalShortcut.register('CommandOrControl+Shift+R', () => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) {
            win.webContents.reloadIgnoringCache();
        }
    });
}
// Set the app user model ID
app.setAppUserModelId('com.ubookdesktop.app');

app.on('ready', async () => {

    await prepDirectories(); // if it's an async function
    await prepNoteFile();
    await prepBookmarkFile();
    await prepFavouriteFile();
    setShortcuts()

    // Create empty menu
    const menu = Menu.buildFromTemplate([]);
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
                isQuiting = true;
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

// app.on('window-all-closed', (event: IpcMainEvent) => {
//     event.preventDefault();
// });

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
        // console.log(`Ensured base directory: ${baseDir}`);

        // Define subdirectories to be created inside .quickai
        const subdirs = ['.saveNotes', '.favourites', '.bookmark', '.cache'];

        subdirs.forEach(sub => {
            const fullPath = path.join(baseDir, sub);
            fs.mkdirSync(fullPath, { recursive: true });
            // console.log(`Ensured subdirectory: ${fullPath}`);
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
        // console.log(`Prep notes file: ${file}`);

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
        // console.log(`Prep favourites file ${file}`);

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
        // console.log(`Prep bookmark file ${file}`);

        // Ensure directory exists
        //await fs.promises.mkdir(path.dirname(file), { recursive: true });

        // Write initial structure
        await fs.promises.writeFile(file, JSON.stringify(structure, null, 2), 'utf8');

        return true; // or true if you want to indicate success after creation
    }
}

// IPC handler for keys reset
ipcMain.handle('get-app-version', async () => {
    try {
        return app.getVersion()
    } catch (err) {
        return 'unknown'
    }
});

ipcMain.handle('get-dev-status', async (_) => {
    return isDev
})

// Listen for theme change events from renderer
ipcMain.on('theme-changed', (_, isDarkMode) => {
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
