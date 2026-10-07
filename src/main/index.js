import { app, shell, BrowserWindow, ipcMain, dialog, screen } from 'electron'
import { join } from 'path'
import { writeFile, readFile } from 'fs/promises'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import iconoPng from '../../resources/icon.png?asset'
import iconoIco from '../../resources/icon.ico?asset'

// En Windows, el .ico multi-tamaño: la barra de tareas usa el monograma LN
// en 16–32px en vez de achicar la placa completa con el texto.
const icon = process.platform === 'win32' ? iconoIco : iconoPng

// Modo demostración (`npm run demo`): perfil de datos aparte, cargado con datos
// ficticios para capturas. Los datos reales (perfil "lo-nuestro") no se tocan.
const MODO_DEMO = process.argv.includes('--demo')
if (MODO_DEMO) {
  app.setPath('userData', join(app.getPath('appData'), 'lo-nuestro-demo'))
}

// Pantalla de carga: tiempo mínimo visible, duración del fundido y
// margen de seguridad por si la ventana principal nunca avisa que está lista.
const SPLASH_MINIMO_MS = 2200
const SPLASH_FUNDIDO_MS = 350
const SPLASH_TIMEOUT_MS = 10000

let mainWindow = null
let splashWindow = null
let splashCreadoEn = 0
let principalMostrada = false

// HMR for renderer base on electron-vite cli.
// Load the remote URL for development or the local html file for production.
function cargarPagina(ventana, pagina) {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    ventana.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/${pagina}`)
  } else {
    ventana.loadFile(join(__dirname, '../renderer', pagina))
  }
}

function cerrarSplash() {
  if (splashWindow && !splashWindow.isDestroyed()) splashWindow.destroy()
  splashWindow = null
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 460,
    height: 520,
    frame: false,
    transparent: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    center: true,
    show: false,
    icon,
    webPreferences: {
      sandbox: true
    }
  })
  splashCreadoEn = Date.now()

  splashWindow.once('ready-to-show', () => splashWindow?.show())
  splashWindow.on('closed', () => {
    splashWindow = null
  })

  cargarPagina(splashWindow, 'splash.html')
}

// Muestra la ventana principal cuando terminó de cargar, respetando el tiempo
// mínimo del splash y desvaneciéndolo antes de cerrarlo.
function mostrarVentanaPrincipal() {
  if (principalMostrada || !mainWindow || mainWindow.isDestroyed()) return
  principalMostrada = true

  const revelar = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show()
      mainWindow.focus()
    }
    cerrarSplash()
  }

  if (!splashWindow) {
    revelar()
    return
  }

  const espera = Math.max(0, SPLASH_MINIMO_MS - (Date.now() - splashCreadoEn))
  setTimeout(() => {
    if (!splashWindow || splashWindow.isDestroyed()) {
      revelar()
      return
    }
    splashWindow.webContents
      .executeJavaScript("document.body.classList.add('saliendo')")
      .catch(() => {})
    setTimeout(revelar, SPLASH_FUNDIDO_MS)
  }, espera)
}

function createWindow() {
  // Tamaño cómodo para el sidebar + contenido, sin pasarse en pantallas chicas.
  const { width: anchoPantalla, height: altoPantalla } = screen.getPrimaryDisplay().workAreaSize

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: Math.min(1280, anchoPantalla),
    height: Math.min(800, altoPantalla),
    minWidth: Math.min(960, anchoPantalla),
    minHeight: Math.min(640, altoPantalla),
    show: false,
    title: 'Lo Nuestro',
    backgroundColor: '#eee4d3',
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      additionalArguments: MODO_DEMO ? ['--lo-nuestro-demo'] : []
    }
  })
  principalMostrada = false

  mainWindow.on('ready-to-show', mostrarVentanaPrincipal)
  mainWindow.on('closed', () => {
    mainWindow = null
    cerrarSplash()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  cargarPagina(mainWindow, 'index.html')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('backup:export', async (_event, jsonString) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Exportar backup',
      defaultPath: `lo-nuestro-backup-${new Date().toISOString().slice(0, 10)}.json`,
      filters: [{ name: 'JSON', extensions: ['json'] }]
    })
    if (canceled || !filePath) return { ok: false }
    await writeFile(filePath, jsonString, 'utf-8')
    return { ok: true, filePath }
  })

  ipcMain.handle('backup:import', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Importar backup',
      filters: [{ name: 'JSON', extensions: ['json'] }],
      properties: ['openFile']
    })
    if (canceled || filePaths.length === 0) return { ok: false }
    const contenido = await readFile(filePaths[0], 'utf-8')
    return { ok: true, contenido }
  })

  ipcMain.handle('reporte:exportar-pdf', async (_event, defaultFileName) => {
    if (!mainWindow) return { ok: false }
    const buffer = await mainWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4'
    })
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Guardar PDF',
      defaultPath: defaultFileName || `reporte-${Date.now()}.pdf`,
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    })
    if (canceled || !filePath) return { ok: false }
    await writeFile(filePath, buffer)
    return { ok: true, filePath }
  })

  // El splash aparece primero; la principal carga en paralelo, oculta.
  createSplashWindow()
  createWindow()
  setTimeout(mostrarVentanaPrincipal, SPLASH_TIMEOUT_MS)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
