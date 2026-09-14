import { useEffect, useMemo, useRef } from 'react'
import { Trash2, X } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { saldoPendiente } from '../../utils/entregas'
import { formatearPesos } from '../../utils/formato'
import { useConfirm } from './ConfirmModal'
import { useToast } from './ToastProvider'
import './ConfirmModal.css'

export default function HistorialClienteModal({ cliente, onCerrar }) {
  const ventas = useStore((state) => state.ventas)
  const eliminarVenta = useStore((state) => state.eliminarVenta)
  const eliminarVentas = useStore((state) => state.eliminarVentas)
  const confirmar = useConfirm()
  const showToast = useToast()
  // Mientras la confirmación está abierta, Escape debe cerrar solo la confirmación.
  const confirmandoRef = useRef(false)

  useEffect(() => {
    if (!cliente) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !confirmandoRef.current) onCerrar()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [cliente, onCerrar])

  const trabajos = useMemo(() => {
    if (!cliente) return []
    const nombre = cliente.nombre.toLowerCase()
    return ventas
      .filter((v) => v.cliente?.toLowerCase() === nombre)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  }, [ventas, cliente])

  if (!cliente) return null

  const pedirConfirmacion = async (mensaje, titulo) => {
    confirmandoRef.current = true
    try {
      return await confirmar(mensaje, { title: titulo, danger: true })
    } finally {
      setTimeout(() => {
        confirmandoRef.current = false
      }, 0)
    }
  }

  const handleBorrarTrabajo = async (trabajo) => {
    const ok = await pedirConfirmacion(
      `Se eliminará el trabajo "${trabajo.titulo}" de forma permanente.`,
      'Borrar trabajo'
    )
    if (!ok) return
    eliminarVenta(trabajo.id)
    showToast('Trabajo eliminado.', 'success')
  }

  const handleBorrarHistorial = async () => {
    const ok = await pedirConfirmacion(
      `Se eliminarán los ${trabajos.length} trabajos de ${cliente.nombre}. El cliente sigue en la agenda.`,
      'Borrar historial del cliente'
    )
    if (!ok) return
    eliminarVentas(trabajos.map((t) => t.id))
    showToast(`Historial de ${cliente.nombre} borrado.`, 'success')
  }

  const totalGastado = trabajos.reduce((acc, v) => acc + (v.totalCobrado || 0), 0)
  const saldoTotal = trabajos.reduce((acc, v) => acc + saldoPendiente(v), 0)
  const ultimoPedido = trabajos[0] ? new Date(trabajos[0].fecha).toLocaleDateString() : '---'

  return (
    <div className="confirm-overlay" onMouseDown={onCerrar}>
      <div
        className="confirm-modal historial-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="historial-cliente-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 id="historial-cliente-title" className="confirm-title m-0">
            Historial de {cliente.nombre}
          </h3>
          <div className="d-flex align-items-center gap-2">
            {trabajos.length > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                onClick={handleBorrarHistorial}
              >
                <Trash2 size={14} /> Borrar historial
              </button>
            )}
            <button type="button" className="btn-cerrar" aria-label="Cerrar" onClick={onCerrar}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="historial-resumen">
          <div>
            <span>Trabajos</span>
            <strong>{trabajos.length}</strong>
          </div>
          <div>
            <span>Total gastado</span>
            <strong style={{ color: 'var(--color-accent)' }}>{formatearPesos(totalGastado)}</strong>
          </div>
          <div>
            <span>Saldo pendiente</span>
            <strong
              style={{ color: saldoTotal > 0 ? 'var(--color-warning)' : 'var(--color-accent)' }}
            >
              {formatearPesos(saldoTotal)}
            </strong>
          </div>
          <div>
            <span>Último pedido</span>
            <strong>{ultimoPedido}</strong>
          </div>
        </div>

        {trabajos.length === 0 ? (
          <p className="text-muted text-center my-4">Este cliente todavía no tiene trabajos.</p>
        ) : (
          <ul className="historial-lista">
            {trabajos.map((t) => {
              const saldo = saldoPendiente(t)
              return (
                <li key={t.id}>
                  <div>
                    <strong>{t.titulo}</strong>
                    <span className="text-muted small d-block">
                      {new Date(t.fecha).toLocaleDateString()} · {t.tipo} · {t.estado || 'A Hacer'}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="text-end">
                      <strong className="celda-numero">{formatearPesos(t.totalCobrado)}</strong>
                      <span
                        className="small d-block"
                        style={{
                          color: saldo > 0 ? 'var(--color-warning)' : 'var(--color-accent)'
                        }}
                      >
                        {saldo > 0 ? `Debe ${formatearPesos(saldo)}` : 'Pagado'}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-icono btn-icono-danger"
                      aria-label={`Borrar trabajo ${t.titulo}`}
                      onClick={() => handleBorrarTrabajo(t)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
