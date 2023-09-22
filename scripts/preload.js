const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
	quit: () => ipcRenderer.send('quit'),
	min: () => ipcRenderer.send('min'),
})