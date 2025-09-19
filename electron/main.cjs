const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let svelteKitProcess;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.cjs')
        },
        titleBarStyle: 'default',
        show: false
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    if (isDev) {

        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {

        startSvelteKitServer();
        mainWindow.loadURL('http://localhost:3000');
    }


    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

function startSvelteKitServer() {
    if (!isDev) {

        svelteKitProcess = spawn('node', ['build/index.js'], {
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit',
            env: { ...process.env, PORT: '3000' }
        });

        svelteKitProcess.on('error', (err) => {
            console.error('Failed to start SvelteKit server:', err);
        });
    }
}


app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (svelteKitProcess) {
            svelteKitProcess.kill();
        }
        app.quit();
    }
});

app.on('before-quit', () => {
    if (svelteKitProcess) {
        svelteKitProcess.kill();
    }
});


ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});

ipcMain.handle('get-platform', () => {
    return process.platform;
});