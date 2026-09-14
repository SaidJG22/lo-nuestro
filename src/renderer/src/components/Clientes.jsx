import { useState } from 'react'
import { useStore } from '../store/useStore'
import {
  Layers,
  Clock,
  Wrench,
  CheckCircle2,
  User,
  Phone,
  X,
  Pencil,
  Search,
  CalendarClock,
  History
} from 'lucide-react'
import { useConfirm } from './ui/ConfirmModal'
import { useToast } from './ui/ToastProvider'
import EditarVentaModal from './ui/EditarVentaModal'
import HistorialClienteModal from './ui/HistorialClienteModal'
import BotonExportarPDF from './ui/BotonExportarPDF'
import { estadoEntrega, formatearFecha, saldoPendiente } from '../utils/entregas'
import { formatearPesos } from '../utils/formato'
import '../styles/Clientes.css'

const ETIQUETA_ENTREGA = {
  vencido: 'Vencido',
  'por-vencer': 'Por vencer',
  'a-tiempo': ''
}

const contarVencidos = (trabajos) =>
  trabajos.filter((t) => estadoEntrega(t.fechaEntrega, t.estado) === 'vencido').length

export default function Clientes() {
  const {
    clientes,
    agregarCliente,
    eliminarCliente,
    ventas,
    actualizarEstadoVenta,
    actualizarVenta,
    eliminarVenta
  } = useStore()
  const confirmar = useConfirm()
  const showToast = useToast()
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [tipo, setTipo] = useState('Consumidor Final')
  const [editando, setEditando] = useState(null)
  const [clienteHistorial, setClienteHistorial] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  const handleAgregar = (e) => {
    e.preventDefault()
    if (!nombre) return
    agregarCliente({ nombre, telefono, tipo })
    setNombre('')
    setTelefono('')
  }

  const handleBorrarFicha = async (trabajo) => {
    const ok = await confirmar(`Se eliminará la ficha "${trabajo.titulo}" de forma permanente.`, {
      title: 'Borrar ficha de trabajo',
      danger: true
    })
    if (ok) eliminarVenta(trabajo.id)
  }

  const handleBorrarCliente = async (cliente) => {
    const ok = await confirmar(`Se eliminará a "${cliente.nombre}" de la agenda de clientes.`, {
      title: 'Borrar cliente',
      danger: true
    })
    if (ok) eliminarCliente(cliente.id)
  }

  const termino = busqueda.trim().toLowerCase()
  const coincideTrabajo = (t) =>
    !termino ||
    t.titulo.toLowerCase().includes(termino) ||
    t.cliente.toLowerCase().includes(termino)

  // Agrupamos los trabajos (ventas) por estado
  const trabajosAHacer = ventas.filter(
    (v) => (v.estado === 'A Hacer' || !v.estado) && coincideTrabajo(v)
  ) // Si es viejo, cae acá por defecto
  const trabajosAArreglar = ventas.filter((v) => v.estado === 'A Arreglar' && coincideTrabajo(v))
  const trabajosTerminados = ventas.filter((v) => v.estado === 'Terminado' && coincideTrabajo(v))
  const clientesFiltrados = clientes.filter(
    (c) => !termino || c.nombre.toLowerCase().includes(termino)
  )

  const renderFicha = (trabajo, claseBorde) => {
    const entrega = estadoEntrega(trabajo.fechaEntrega, trabajo.estado)
    const saldo = saldoPendiente(trabajo)
    const sena = trabajo.sena || 0
    return (
      <div key={trabajo.id} className={`ficha-trabajo ${claseBorde}`}>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="fw-bold mb-0" style={{ color: 'var(--color-text)' }}>
            {trabajo.titulo}
          </h5>
          <div className="d-flex gap-1">
            <button
              className="btn-cerrar"
              aria-label="Editar ficha de trabajo"
              onClick={() => setEditando(trabajo)}
            >
              <Pencil size={14} />
            </button>
            <button
              className="btn-cerrar"
              aria-label="Borrar ficha de trabajo"
              onClick={() => handleBorrarFicha(trabajo)}
            >
              <X size={14} />
            </button>
          </div>
        </div>
        <p className="ficha-cliente mb-1 fw-bold">
          <User size={14} /> {trabajo.cliente}
        </p>
        <p className="text-muted small mb-2">
          {new Date(trabajo.fecha).toLocaleDateString()} - {trabajo.tipo}
        </p>
        {trabajo.fechaEntrega && (
          <span className={`entrega-badge ${entrega ? `entrega-${entrega}` : 'entrega-terminado'}`}>
            <CalendarClock size={12} /> Entrega: {formatearFecha(trabajo.fechaEntrega)}
            {entrega && ETIQUETA_ENTREGA[entrega] && ` · ${ETIQUETA_ENTREGA[entrega]}`}
          </span>
        )}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex flex-column">
            <span className="ficha-precio fw-bold">{formatearPesos(trabajo.totalCobrado)}</span>
            {saldo === 0 ? (
              <span className="ficha-pago ficha-pago-ok">Pagado</span>
            ) : (
              <span className="ficha-pago">
                {sena > 0 && `Seña ${formatearPesos(sena)} · `}Debe {formatearPesos(saldo)}
              </span>
            )}
          </div>
          <select
            className="form-select form-select-sm w-auto input-dark"
            value={trabajo.estado || 'A Hacer'}
            onChange={(e) => actualizarEstadoVenta(trabajo.id, e.target.value)}
          >
            <option value="A Hacer">⏳ A Hacer</option>
            <option value="A Arreglar">🛠️ A Arreglar</option>
            <option value="Terminado">✅ Terminado</option>
          </select>
        </div>
      </div>
    )
  }

  const vencidosAHacer = contarVencidos(trabajosAHacer)
  const vencidosAArreglar = contarVencidos(trabajosAArreglar)

  return (
    <div className="clientes-container fade-in">
      <div className="clientes-filtros">
        <div className="buscador-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar por cliente o producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="btn-exportar-clientes">
          <BotonExportarPDF
            printClass="modo-impresion-clientes"
            fileName={() => `reporte-clientes-${new Date().toISOString().slice(0, 10)}.pdf`}
            label="Exportar Clientes a PDF"
            validar={() => true}
          />
        </div>
      </div>

      {/* SECCIÓN 1: TABLERO DE TRABAJOS (KANBAN) */}
      <h3 className="d-flex align-items-center gap-2 mb-0" style={{ color: 'var(--color-text)' }}>
        <Layers size={20} /> Estado de Trabajos
      </h3>
      <div className="kanban-board">
        <div className="kanban-col">
          <div className="kanban-header kanban-header-warning">
            <Clock size={16} /> A Hacer ({trabajosAHacer.length})
            {vencidosAHacer > 0 && (
              <span className="kanban-vencidos">
                · {vencidosAHacer} vencido{vencidosAHacer === 1 ? '' : 's'}
              </span>
            )}
          </div>
          <div className="kanban-body">
            {trabajosAHacer.map((t) => renderFicha(t, 'ficha-a-hacer'))}
          </div>
        </div>

        <div className="kanban-col">
          <div className="kanban-header kanban-header-danger">
            <Wrench size={16} /> A Arreglar ({trabajosAArreglar.length})
            {vencidosAArreglar > 0 && (
              <span className="kanban-vencidos">
                · {vencidosAArreglar} vencido{vencidosAArreglar === 1 ? '' : 's'}
              </span>
            )}
          </div>
          <div className="kanban-body">
            {trabajosAArreglar.map((t) => renderFicha(t, 'ficha-a-arreglar'))}
          </div>
        </div>

        <div className="kanban-col">
          <div className="kanban-header kanban-header-accent">
            <CheckCircle2 size={16} /> Terminados ({trabajosTerminados.length})
          </div>
          <div className="kanban-body">
            {trabajosTerminados.map((t) => renderFicha(t, 'ficha-terminado'))}
          </div>
        </div>
      </div>

      <hr style={{ borderColor: 'var(--color-border)', opacity: 0.5 }} />

      {/* SECCIÓN 2: AGENDA DE CLIENTES */}
      <div className="glass-panel panel-formulario-clientes mt-3">
        <h4 className="mb-4" style={{ color: 'var(--color-info)' }}>
          Registrar Nuevo Cliente a la Agenda
        </h4>
        <form onSubmit={handleAgregar} className="cliente-form">
          <div className="campo-cliente campo-cliente-nombre">
            <label htmlFor="cli-nombre">Nombre o Razón Social</label>
            <input
              id="cli-nombre"
              type="text"
              className="form-control input-dark"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="campo-cliente">
            <label htmlFor="cli-telefono">Teléfono / WhatsApp</label>
            <input
              id="cli-telefono"
              type="text"
              className="form-control input-dark"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
          <div className="campo-cliente">
            <label htmlFor="cli-tipo">Tipo</label>
            <select
              id="cli-tipo"
              className="form-select input-dark"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option>Consumidor Final</option>
              <option>Empresa / Local</option>
            </select>
          </div>
          <div className="campo-cliente campo-cliente-submit">
            <button type="submit" className="btn btn-primary w-100">
              Guardar
            </button>
          </div>
        </form>
      </div>

      <div className="clientes-grid mt-2">
        {clientesFiltrados.map((cliente) => (
          <div key={cliente.id} className="cliente-card">
            <span
              className={`cliente-tipo ${cliente.tipo === 'Empresa / Local' ? 'tipo-empresa' : 'tipo-consumidor'}`}
            >
              {cliente.tipo}
            </span>
            <h4 className="mb-1" style={{ color: 'var(--color-text)' }}>
              {cliente.nombre}
            </h4>
            <p className="text-muted mb-3 d-flex align-items-center gap-2">
              <Phone size={14} /> {cliente.telefono || 'Sin teléfono'}
            </p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
                onClick={() => setClienteHistorial(cliente)}
              >
                <History size={14} /> Ver historial
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleBorrarCliente(cliente)}
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>

      <EditarVentaModal
        key={editando?.id ?? 'cerrado'}
        trabajo={editando}
        onCerrar={() => setEditando(null)}
        onGuardar={(id, cambios) => {
          actualizarVenta(id, cambios)
          setEditando(null)
          showToast('Trabajo actualizado.', 'success')
        }}
      />

      <HistorialClienteModal
        cliente={clienteHistorial}
        onCerrar={() => setClienteHistorial(null)}
      />
    </div>
  )
}
