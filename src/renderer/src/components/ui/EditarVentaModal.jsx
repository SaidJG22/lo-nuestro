import { useState } from 'react'
import { X } from 'lucide-react'
import { formatearPesos } from '../../utils/formato'
import './ConfirmModal.css'

export default function EditarVentaModal({ trabajo, onGuardar, onCerrar }) {
  const [titulo, setTitulo] = useState(trabajo?.titulo ?? '')
  const [cliente, setCliente] = useState(trabajo?.cliente ?? '')
  const [costo, setCosto] = useState(String(Math.round(trabajo?.costo ?? 0)))
  const [totalCobrado, setTotalCobrado] = useState(String(Math.round(trabajo?.totalCobrado ?? 0)))
  const [sena, setSena] = useState(String(trabajo?.sena ?? ''))
  const [fechaEntrega, setFechaEntrega] = useState(trabajo?.fechaEntrega ?? '')

  if (!trabajo) return null

  const redondear = (valor) => Math.round(parseFloat(valor) || 0)
  const totalNumero = redondear(totalCobrado)
  const senaNumero = redondear(sena)
  const costoNumero = redondear(costo)
  const gananciaCalculada = totalNumero - costoNumero
  const saldo = Math.max(totalNumero - senaNumero, 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    onGuardar(trabajo.id, {
      titulo,
      cliente,
      costo: costoNumero,
      totalCobrado: totalNumero,
      ganancia: gananciaCalculada,
      sena: senaNumero,
      fechaEntrega
    })
  }

  return (
    <div className="confirm-overlay" onMouseDown={onCerrar}>
      <div
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editar-venta-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 id="editar-venta-title" className="confirm-title m-0">
            Editar Trabajo
          </h3>
          <button type="button" className="btn-cerrar" aria-label="Cerrar" onClick={onCerrar}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label">Producto</label>
            <input
              className="form-control input-dark"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Cliente</label>
            <input
              className="form-control input-dark"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </div>
          <div className="d-flex gap-2">
            <div className="flex-fill">
              <label className="form-label">Costo Base ($)</label>
              <input
                type="number"
                className="form-control input-dark"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
              />
            </div>
            <div className="flex-fill">
              <label className="form-label">Total Cobrado ($)</label>
              <input
                type="number"
                className="form-control input-dark"
                value={totalCobrado}
                onChange={(e) => setTotalCobrado(e.target.value)}
              />
            </div>
          </div>
          <div className="d-flex gap-2">
            <div className="flex-fill">
              <label className="form-label">Seña cobrada ($)</label>
              <input
                type="number"
                min="0"
                className="form-control input-dark"
                value={sena}
                onChange={(e) => setSena(e.target.value)}
              />
            </div>
            <div className="flex-fill">
              <label className="form-label">Fecha de entrega</label>
              <input
                type="date"
                className="form-control input-dark"
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
              />
            </div>
          </div>
          <p className="text-muted small m-0">
            Ganancia resultante:{' '}
            <strong style={{ color: 'var(--color-accent)' }}>
              {formatearPesos(gananciaCalculada)}
            </strong>
            {' · '}
            Saldo pendiente:{' '}
            <strong style={{ color: saldo > 0 ? 'var(--color-warning)' : 'var(--color-accent)' }}>
              {formatearPesos(saldo)}
            </strong>
          </p>
          <div className="confirm-actions">
            <button type="button" className="confirm-btn confirm-btn-cancel" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="confirm-btn confirm-btn-accept">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
