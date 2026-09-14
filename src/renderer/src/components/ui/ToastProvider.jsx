import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import './Toast.css'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info
}

const AUTO_DISMISS_MS = 4000

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const showToast = useCallback(
    (message, type = 'info', options = {}) => {
      const { actionLabel, onAction } = options
      const id = Date.now() + Math.random()
      setToasts((current) => [...current, { id, message, type, actionLabel, onAction }])
      const timer = setTimeout(() => dismissToast(id), AUTO_DISMISS_MS)
      timers.current.set(id, timer)
    },
    [dismissToast]
  )

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="toast-stack" role="region" aria-live="polite" aria-label="Notificaciones">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || Info
          return (
            <div key={toast.id} className={`toast-item toast-${toast.type}`}>
              <Icon size={18} className="toast-icon" />
              <span className="toast-message">{toast.message}</span>
              {toast.onAction && (
                <button
                  type="button"
                  className="toast-action"
                  onClick={() => {
                    toast.onAction()
                    dismissToast(toast.id)
                  }}
                >
                  {toast.actionLabel || 'Deshacer'}
                </button>
              )}
              <button
                type="button"
                className="toast-close"
                aria-label="Cerrar notificación"
                onClick={() => dismissToast(toast.id)}
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const showToast = useContext(ToastContext)
  if (!showToast) {
    throw new Error('useToast debe usarse dentro de un ToastProvider')
  }
  return showToast
}
