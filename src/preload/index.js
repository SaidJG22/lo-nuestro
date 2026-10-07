import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  exportarBackup: (jsonString) => ipcRenderer.invoke('backup:export', jsonString),
  importarBackup: () => ipcRenderer.invoke('backup:import'),
  exportarPDF: (defaultFileName) => ipcRenderer.invoke('reporte:exportar-pdf', defaultFileName),
  // true cuando la app se abrió con `npm run demo` (perfil con datos ficticios)
  esDemo: process.argv.includes('--lo-nuestro-demo')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
