import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AlertTriangle, HelpCircle } from 'lucide-react'
import './ConfirmModal.css'

const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null)
  const resolveRef = useRef(null)
  const cancelButtonRef = useRef(null)

  const confirmar = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve
      setRequest({
        message,
        title: options.title || '¿Confirmás esta acción?',
        danger: Boolean(options.danger)
      })
    })
  }, [])

  const responder = useCallback((resultado) => {
    if (resolveRef.current) {
      resolveRef.current(resultado)
      resolveRef.current = null
    }
    setRequest(null)
  }, [])

  useEffect(() => {
    if (!request) return undefined
    cancelButtonRef.current?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') responder(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [request, responder])

  const Icon = request?.danger ? AlertTriangle : HelpCircle

  return (
    <ConfirmContext.Provider value={confirmar}>
      {children}
      {request && (
        <div className="confirm-overlay" onMouseDown={() => responder(false)}>
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={`confirm-icon ${request.danger ? 'confirm-icon-danger' : ''}`}>
              <Icon size={22} />
            </div>
            <h3 id="confirm-modal-title" className="confirm-title">
              {request.title}
            </h3>
            <p className="confirm-message">{request.message}</p>
            <div className="confirm-actions">
              <button
                type="button"
                ref={cancelButtonRef}
                className="confirm-btn confirm-btn-cancel"
                onClick={() => responder(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`confirm-btn ${request.danger ? 'confirm-btn-danger' : 'confirm-btn-accept'}`}
                onClick={() => responder(true)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConfirm() {
  const confirmar = useContext(ConfirmContext)
  if (!confirmar) {
    throw new Error('useConfirm debe usarse dentro de un ConfirmProvider')
  }
  return confirmar
}
