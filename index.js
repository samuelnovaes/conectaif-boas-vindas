const { app, BrowserWindow } = require('electron')
const path = require('path')

app.on('ready', () => {
	const win = new BrowserWindow({
		title: 'Conecta IF - Boas Vindas',
		width: 672,
		height: 558,
		resizable: false,
		show: false
	})

	win.loadFile(path.join(__dirname, 'index.html'))

	win.on('ready-to-show', () => {
		win.show()
	})
})

app.on('window-all-closed', () => {
	app.quit()
})