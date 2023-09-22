const{ app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

let win;

const createWin = () => {
	win = new BrowserWindow({
		width: 240,
		height: 200,
		minWidth: 180,
		minHeight: 180,
		frame: false,
		alwaysOnTop: true,

		transparent: true,
		webPreferences: {
			isSecureContext: true,
			nodeIntegration: true,
			preload: path.join(__dirname + '/scripts/preload.js')
		}
	})

	win.loadFile('./index.html');
	win.webContents.openDevTools();

	// titleBar кнопки
	ipcMain.on('min', () => {
		win.minimize();
	})

	ipcMain.on('quit', () => {
		app.quit();
	})
}

app.whenReady().then(createWin)
