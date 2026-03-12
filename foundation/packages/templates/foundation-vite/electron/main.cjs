/**
 * electron/main.cjs
 *
 * Terakota Foundation — Electron main process.
 *
 * Key differences from the original Terakota electronMain.js:
 *  - CJS format (.cjs) so it works alongside Vite's ESM output.
 *  - Loads dist/index.html (Vite build) in production.
 *  - Uses HashRouter-compatible hash URL (#/) for file:// protocol.
 *  - Electron 28+ supports macOS 10.15 (Catalina) and above.
 *
 * To run in dev: `yarn dev:electron`
 * To build:      `yarn build:electron`
 */

const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow = null;

function createMainWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        width: Math.min(1440, width),
        height: Math.min(900, height),
        minWidth: 900,
        minHeight: 600,
        show: false,
        autoHideMenuBar: true,
        titleBarStyle: 'hiddenInset', // macOS: native traffic lights
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs'),
            webSecurity: true,
        },
    });

    // ── Load the app ──────────────────────────────────────────────────────
    if (isDev) {
        // Dev: point at Vite dev server (BrowserRouter becomes HashRouter here)
        mainWindow.loadURL('http://localhost:3009');
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
        // Production: load the Vite-built dist/index.html
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    mainWindow.once('ready-to-show', () => mainWindow.show());

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// ── App lifecycle ─────────────────────────────────────────────────────────────
app.whenReady().then(() => {
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// ── IPC handlers ──────────────────────────────────────────────────────────────
// Minimal IPC surface. Add handlers here as features require them.
// Pattern mirrors ipcEvents.js from original Terakota but keeps this file lean.

ipcMain.handle('app:version', () => app.getVersion());

ipcMain.handle('app:platform', () => process.platform);

// Theme IPC — renderer can query or set native title bar tinting (macOS only)
ipcMain.on('theme:changed', (_, mode) => {
    if (mainWindow) {
        // nativeTheme.themeSource = mode; // Uncomment to sync OS-level dark mode
    }
});

module.exports = { createMainWindow };
