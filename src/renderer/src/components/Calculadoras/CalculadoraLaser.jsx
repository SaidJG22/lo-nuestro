import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { useToast } from '../ui/ToastProvider'
import SeccionFormulario from '../ui/SeccionFormulario'
import SelectorEstadoTrabajo from '../ui/SelectorEstadoTrabajo'
import SelectorTipoTrabajo from '../ui/SelectorTipoTrabajo'
import SelectorMaterial from '../ui/SelectorMaterial'
import ListaExtras from '../ui/ListaExtras'
import BotonExportarPDF from '../ui/BotonExportarPDF'
import { Settings, Flame, Layers, Gauge } from 'lucide-react'
import '../../styles/Calculadora.css'

export default function CalculadoraLaser({ tipoActual, setTipoActual }) {
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

  // VARIABLES LÁSER
  const [materialId, setMaterialId] = useState('')
  const [costoPlancha, setCostoPlancha] = useState('')
  const [anchoPlancha, setAnchoPlancha] = useState('100')
  const [altoPlancha, setAltoPlancha] = useState('100')
  const [anchoUtilizado, setAnchoUtilizado] = useState('')
  const [altoUtilizado, setAltoUtilizado] = useState('')
  const [extras, setExtras] = useState([])
  const [desgasteTubo, setDesgasteTubo] = useState('1500')
  const [electricidadLaser, setElectricidadLaser] = useState('200')
  const [mantenimientoLaser, setMantenimientoLaser] = useState('300')
  const [tiempoMaquinaLaser, setTiempoMaquinaLaser] = useState('')
  const [precioHoraManoObra, setPrecioHoraManoObra] = useState('3500')
  const [tiempoDiseno, setTiempoDiseno] = useState('')
  const [tiempoOperacion, setTiempoOperacion] = useState('')
  const [flete, setFlete] = useState('')
  const [margenGanancia, setMargenGanancia] = useState('50')

  // MATEMÁTICA LÁSER
  const areaTotal = (parseFloat(anchoPlancha) || 0) * (parseFloat(altoPlancha) || 0)
  const areaUtilizada = (parseFloat(anchoUtilizado) || 0) * (parseFloat(altoUtilizado) || 0)
  const proporcionArea =
    areaTotal > 0 ? ((parseFloat(costoPlancha) || 0) / areaTotal) * areaUtilizada : 0
  const costoExtrasTotal = extras.reduce((acc, f) => acc + (parseFloat(f.monto) || 0), 0)
  const costoMaterialLaser = proporcionArea + costoExtrasTotal

  const costoHoraMaquinaLaser =
    (parseFloat(desgasteTubo) || 0) +
    (parseFloat(electricidadLaser) || 0) +
    (parseFloat(mantenimientoLaser) || 0)
  const costoTotalMaquinaLaser = costoHoraMaquinaLaser * (parseFloat(tiempoMaquinaLaser) || 0)
  const costoTotalManoObraLaser =
    (parseFloat(precioHoraManoObra) || 0) *
    ((parseFloat(tiempoDiseno) || 0) + (parseFloat(tiempoOperacion) || 0))

  const costoBaseLaser =
    costoMaterialLaser + costoTotalMaquinaLaser + costoTotalManoObraLaser + (parseFloat(flete) || 0)
  const precioFinalLaser =
    costoBaseLaser + costoBaseLaser * ((parseFloat(margenGanancia) || 0) / 100)

  const handleGuardar = () => {
    if (!producto || !cliente)
      return showToast('Por favor, ingresá el Nombre del Producto y el Cliente.', 'error')
    agregarVenta({
      titulo: producto,
      cliente,
      tipo: tipoActual,
      estado: estadoTrabajo,
      costo: costoBaseLaser,
      ganancia: precioFinalLaser - costoBaseLaser,
      totalCobrado: precioFinalLaser
    })
    if (materialId) {
      const item = inventario.find((m) => String(m.id) === materialId)
      if (item) actualizarStock(item.id, -1)
    }
    extras.forEach((fila) => {
      if (!fila.materialId) return
      const item = inventario.find((m) => String(m.id) === fila.materialId)
      if (item) actualizarStock(item.id, -1)
    })
    showToast(`¡Trabajo guardado como "${estadoTrabajo}"!`, 'success')
    setProducto('')
    setCliente('')
    setMaterialId('')
    setCostoPlancha('')
    setAnchoUtilizado('')
    setAltoUtilizado('')
    setExtras([])
    setTiempoMaquinaLaser('')
    setTiempoDiseno('')
    setTiempoOperacion('')
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
            <Settings size={20} /> Datos del Trabajo (Láser)
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
            <label className="form-label text-primary">Nombre del Cliente</label>
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
            <h6
              className="d-flex align-items-center gap-2 fw-bold mb-3"
              style={{ color: 'var(--color-danger)' }}
            >
              <Flame size={16} /> Variables de Corte Láser
            </h6>

            <SeccionFormulario icon={Layers} title="1. Materiales">
              <div className="grid-inputs">
                <SelectorMaterial
                  inventario={inventario}
                  materialId={materialId}
                  setMaterialId={setMaterialId}
                  onSeleccionar={(item) => setCostoPlancha(item.costo)}
                />
                <div>
                  <label className="form-label">Costo Plancha ($)</label>
                  <input
                    type="number"
                    className="form-control input-dark border-danger"
                    value={costoPlancha}
                    onChange={(e) => setCostoPlancha(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Área Total (cm)</label>
                  <div className="d-flex gap-1">
                    <input
                      type="number"
                      className="form-control input-dark"
                      value={anchoPlancha}
                      onChange={(e) => setAnchoPlancha(e.target.value)}
                    />
                    <input
                      type="number"
                      className="form-control input-dark"
                      value={altoPlancha}
                      onChange={(e) => setAltoPlancha(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Área Usada (cm)</label>
                  <div className="d-flex gap-1">
                    <input
                      type="number"
                      className="form-control input-dark border-danger"
                      value={anchoUtilizado}
                      onChange={(e) => setAnchoUtilizado(e.target.value)}
                    />
                    <input
                      type="number"
                      className="form-control input-dark border-danger"
                      value={altoUtilizado}
                      onChange={(e) => setAltoUtilizado(e.target.value)}
                    />
                  </div>
                </div>
                <ListaExtras inventario={inventario} extras={extras} setExtras={setExtras} />
              </div>
            </SeccionFormulario>

            <SeccionFormulario icon={Gauge} title="2. Costos de Máquina y Tiempos">
              <div className="grid-inputs">
                <div className="campo-full">
                  <label className="form-label">
                    Costos Fijos x Hora ($): Desgaste Tubo | Luz | Mant.
                  </label>
                  <div className="d-flex gap-1">
                    <input
                      type="number"
                      className="form-control input-dark"
                      value={desgasteTubo}
                      onChange={(e) => setDesgasteTubo(e.target.value)}
                    />
                    <input
                      type="number"
                      className="form-control input-dark"
                      value={electricidadLaser}
                      onChange={(e) => setElectricidadLaser(e.target.value)}
                    />
                    <input
                      type="number"
                      className="form-control input-dark"
                      value={mantenimientoLaser}
                      onChange={(e) => setMantenimientoLaser(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Hs Máquina</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control input-dark border-danger"
                    value={tiempoMaquinaLaser}
                    onChange={(e) => setTiempoMaquinaLaser(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Hs Diseño</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control input-dark border-danger"
                    value={tiempoDiseno}
                    onChange={(e) => setTiempoDiseno(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Hs Operación</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control input-dark border-danger"
                    value={tiempoOperacion}
                    onChange={(e) => setTiempoOperacion(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Valor Hora ($)</label>
                  <input
                    type="number"
                    className="form-control input-dark border-danger"
                    value={precioHoraManoObra}
                    onChange={(e) => setPrecioHoraManoObra(e.target.value)}
                  />
                </div>
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
            <span>Material (Plancha + Extras):</span>
            <span>${costoMaterialLaser.toFixed(2)}</span>
          </div>
          <div className="ticket-item">
            <span>Uso de Máquina:</span>
            <span>${costoTotalMaquinaLaser.toFixed(2)}</span>
          </div>
          <div className="ticket-item">
            <span>Mano de Obra:</span>
            <span>${costoTotalManoObraLaser.toFixed(2)}</span>
          </div>
          <div className="ticket-item">
            <span>Fletes / Extras:</span>
            <span>${(parseFloat(flete) || 0).toFixed(2)}</span>
          </div>
          <div className="ticket-item mt-3 border-0">
            <span className="text-info">COSTO BASE TOTAL:</span>
            <span className="text-info fw-bold">${costoBaseLaser.toFixed(2)}</span>
          </div>
          <div className="ticket-item border-0">
            <span className="text-warning">Ganancia ({margenGanancia}%):</span>
            <span className="text-warning">
              + ${((costoBaseLaser * (parseFloat(margenGanancia) || 0)) / 100).toFixed(2)}
            </span>
          </div>
          <div className="ticket-total">
            <span>PRECIO VENTA:</span>
            <span>${precioFinalLaser.toFixed(2)}</span>
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
