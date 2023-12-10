const { app, BrowserWindow, ipcMain, globalShortcut, webContents} = require('electron');
const path = require('path');

let win;

const createWin = () => {
	win = new BrowserWindow({
		width: 320,
		height: 200,
		minWidth: 180,
		minHeight: 180,
		frame: false,
		alwaysOnTop: true,
		icon: __dirname + "/assets/icon.ico",
		transparent: true,
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
		}
	})

	globalShortcut.register('Alt+F1', () => {
		win.webContents.send('f1')
	})

	globalShortcut.register('Alt+F2', () =>{
		win.webContents.send('f2')		
	})

	// win.webContents.openDevTools();
	win.loadFile('./index.html');

	// titleBar кнопки
	ipcMain.on('min', () => {
		win.minimize();
	})

	ipcMain.on('quit', () => {
		app.quit();
	})
}

app.whenReady().then(createWin);