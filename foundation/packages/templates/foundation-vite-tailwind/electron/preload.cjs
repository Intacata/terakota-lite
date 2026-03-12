/**
 * electron/preload.cjs
 *
 * Exposes a safe, typed bridge between the Electron main process and the
 * renderer (React app). Only explicitly listed APIs cross the boundary.
 *
 * Usage in React:
 *   const version = await window.terakota.getVersion();
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('terakota', {
    // ── App info ──────────────────────────────────────────────────────────
    getVersion:  () => ipcRenderer.invoke('app:version'),
    getPlatform: () => ipcRenderer.invoke('app:platform'),

    // ── Theme ─────────────────────────────────────────────────────────────
    notifyThemeChange: (mode) => ipcRenderer.send('theme:changed', mode),

    // ── Add new IPC bridges here as features require them ─────────────────
    // openWindow: (options) => ipcRenderer.invoke('window:open', options),
});
