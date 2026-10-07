import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ToastProvider } from './components/ui/ToastProvider'
import { ConfirmProvider } from './components/ui/ConfirmModal'
import { useStore } from './store/useStore'
import { crearDatosDemo } from './demo/datosDemo'

// Modo demostración (`npm run demo`): perfil aparte que se recarga con datos
// ficticios en cada arranque, así "hoy" y los últimos 14 días siempre tienen actividad.
if (window.api?.esDemo) {
  useStore.getState().restaurarBackup(crearDatosDemo())
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </ToastProvider>
  </StrictMode>
)
