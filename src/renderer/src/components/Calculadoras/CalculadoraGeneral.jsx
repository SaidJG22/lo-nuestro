import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { useToast } from '../ui/ToastProvider'
import SeccionFormulario from '../ui/SeccionFormulario'
import SelectorEstadoTrabajo from '../ui/SelectorEstadoTrabajo'
import SelectorTipoTrabajo from '../ui/SelectorTipoTrabajo'
import SelectorMaterial from '../ui/SelectorMaterial'
import ListaExtras from '../ui/ListaExtras'
import BotonExportarPDF from '../ui/BotonExportarPDF'
import { Settings, Wrench } from 'lucide-react'
import { formatearPesos } from '../../utils/formato'
import '../../styles/Calculadora.css'

export default function CalculadoraGeneral({ tipoActual, setTipoActual }) {
  const {
    agregarVenta,
    tiposTrabajo,
    agregarTipoTrabajo,
    eliminarTipoTrabajo,
    clientes,
    inventario,
    actualizarStock
  } = useStore()
  const showToast = useToast()

  const [cliente, setCliente] = useState('')
  const [producto, setProducto] = useState('')
  const [estadoTrabajo, setEstadoTrabajo] = useState('A Hacer')

  const [materialId, setMaterialId] = useState('')
  const [costoMaterialesGen, setCostoMaterialesGen] = useState('')
  const [extras, setExtras] = useState([])
  const [horasManoObraGen, setHorasManoObraGen] = useState('')
  const [valorHoraObraGen, setValorHoraObraGen] = useState('3500')
  const [flete, setFlete] = useState('')
  const [margenGanancia, setMargenGanancia] = useState('50')

  // MATEMÁTICA GENERAL
  const costoManoObraGenTotal =
    (parseFloat(horasManoObraGen) || 0) * (parseFloat(valorHoraObraGen) || 0)
  const costoExtrasTotal = extras.reduce((acc, f) => acc + (parseFloat(f.monto) || 0), 0)
  const costoBaseGen =
    (parseFloat(costoMaterialesGen) || 0) +
    costoExtrasTotal +
    costoManoObraGenTotal +
    (parseFloat(flete) || 0)
  const precioFinalGen = costoBaseGen + costoBaseGen * ((parseFloat(margenGanancia) || 0) / 100)

  const handleGuardar = () => {
    if (!producto || !cliente)
      return showToast('Por favor, ingresá el Nombre del Producto y el Cliente.', 'error')
    agregarVenta({
      titulo: producto,
      cliente,
      tipo: tipoActual,
      estado: estadoTrabajo,
      costo: Math.round(costoBaseGen),
      ganancia: Math.round(precioFinalGen) - Math.round(costoBaseGen),
      totalCobrado: Math.round(precioFinalGen),
      sena: 0
    })
    const motivo = `Cotización: ${producto}`
    if (materialId) {
      const item = inventario.find((m) => String(m.id) === materialId)
      if (item) actualizarStock(item.id, -1, motivo)
    }
    extras.forEach((fila) => {
      if (!fila.materialId) return
      const item = inventario.find((m) => String(m.id) === fila.materialId)
      if (item) actualizarStock(item.id, -1, motivo)
    })
    showToast(`¡Trabajo guardado como "${estadoTrabajo}"!`, 'success')
    setProducto('')
    setCliente('')
    setMaterialId('')
    setCostoMaterialesGen('')
    setExtras([])
    setHorasManoObraGen('')
    setFlete('')
  }

  return (
    <div className="calculadora-container">
      <datalist id="lista-clientes-guardados">
        {clientes.map((c) => (
          <option key={c.id} value={c.nombre} />
        ))}
      </datalist>

      <div className="glass-panel panel-formulario" style={{ overflowY: 'auto' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3
            className="d-flex align-items-center gap-2 m-0"
            style={{ color: 'var(--color-warning)' }}
          >
            <Settings size={20} /> Datos del Trabajo (General)
          </h3>
          <SelectorEstadoTrabajo value={estadoTrabajo} onChange={setEstadoTrabajo} />
        </div>

        <div className="row g-3">
          <div className="col-md-12">
            <SelectorTipoTrabajo
              tiposTrabajo={tiposTrabajo}
              tipoActual={tipoActual}
              setTipoActual={setTipoActual}
              agregarTipoTrabajo={agregarTipoTrabajo}
              eliminarTipoTrabajo={eliminarTipoTrabajo}
            />
          </div>

          <div className="col-md-6 mt-4">
            <label className="form-label text-primary">Nombre Cliente</label>
            <input
              type="text"
              list="lista-clientes-guardados"
              className="form-control input-dark"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </div>
          <div className="col-md-6 mt-4">
            <label className="form-label text-primary">Producto a Entregar</label>
            <input
              type="text"
              className="form-control input-dark"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
            />
          </div>

          <div className="col-12 mt-4">
            <SeccionFormulario icon={Wrench} title="Insumos Generales">
              <div className="grid-inputs">
                <SelectorMaterial
                  inventario={inventario}
                  materialId={materialId}
                  setMaterialId={setMaterialId}
                  onSeleccionar={(item) => setCostoMaterialesGen(item.costo)}
                />
                <div className="campo-full">
                  <label className="form-label">Materiales ($)</label>
                  <input
                    type="number"
                    className="form-control input-dark"
                    value={costoMaterialesGen}
                    onChange={(e) => setCostoMaterialesGen(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label text-info">Horas Trabajadas</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control input-dark"
                    value={horasManoObraGen}
                    onChange={(e) => setHorasManoObraGen(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label text-info">Valor Hora ($)</label>
                  <input
                    type="number"
                    className="form-control input-dark"
                    value={valorHoraObraGen}
                    onChange={(e) => setValorHoraObraGen(e.target.value)}
                  />
                </div>
                <ListaExtras inventario={inventario} extras={extras} setExtras={setExtras} />
              </div>
            </SeccionFormulario>
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label">Flete / Extras ($)</label>
            <input
              type="number"
              className="form-control input-dark"
              value={flete}
              onChange={(e) => setFlete(e.target.value)}
            />
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label text-success">Margen Ganancia (%)</label>
            <input
              type="number"
              className="form-control input-dark"
              value={margenGanancia}
              onChange={(e) => setMargenGanancia(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="panel-ticket">
        <div className="ticket-resumen shadow-lg">
          <h3 className="ticket-titulo">Ticket de Cotización</h3>
          <div className="text-center mb-4 pb-3 border-bottom border-secondary">
            <h5 className="text-primary fw-bold mb-1">{producto || '---'}</h5>
            <span className="text-muted small">
              Para: {cliente || '---'} | {tipoActual}
            </span>
          </div>
          <div className="ticket-item">
            <span>Materiales:</span>
            <span>{formatearPesos(parseFloat(costoMaterialesGen) || 0)}</span>
          </div>
          <div className="ticket-item">
            <span>Extras (Pintura, Lijas, etc.):</span>
            <span>{formatearPesos(costoExtrasTotal)}</span>
          </div>
          <div className="ticket-item">
            <span>Mano de Obra:</span>
            <span>{formatearPesos(costoManoObraGenTotal)}</span>
          </div>
          <div className="ticket-item">
            <span>Fletes / Extras:</span>
            <span>{formatearPesos(parseFloat(flete) || 0)}</span>
          </div>
          <div className="ticket-item mt-3 border-0">
            <span className="text-info">COSTO BASE TOTAL:</span>
            <span className="text-info fw-bold">{formatearPesos(costoBaseGen)}</span>
          </div>
          <div className="ticket-item border-0">
            <span className="text-warning">Ganancia ({margenGanancia}%):</span>
            <span className="text-warning">
              + {formatearPesos((costoBaseGen * (parseFloat(margenGanancia) || 0)) / 100)}
            </span>
          </div>
          <div className="ticket-total">
            <span>PRECIO VENTA:</span>
            <span>{formatearPesos(precioFinalGen)}</span>
          </div>
        </div>
        <button className="btn-guardar mt-auto" onClick={handleGuardar}>
          Guardar Trabajo
        </button>
        <BotonExportarPDF producto={producto} />
      </div>
    </div>
  )
}
