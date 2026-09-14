import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { useToast } from '../ui/ToastProvider'
import SeccionFormulario from '../ui/SeccionFormulario'
import SelectorEstadoTrabajo from '../ui/SelectorEstadoTrabajo'
import SelectorTipoTrabajo from '../ui/SelectorTipoTrabajo'
import SelectorMaterial from '../ui/SelectorMaterial'
import ListaExtras from '../ui/ListaExtras'
import BotonExportarPDF from '../ui/BotonExportarPDF'
import { Settings, Boxes, Gauge } from 'lucide-react'
import { formatearPesos } from '../../utils/formato'
import '../../styles/Calculadora.css'

export default function Calculadora3D({ tipoActual, setTipoActual }) {
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

  // 1. VARIABLES DE ENTRADA
  const [materialId, setMaterialId] = useState('')
  const [precioRollo3D, setPrecioRollo3D] = useState('18000')
  const [gramos3D, setGramos3D] = useState('')
  const [horas3D, setHoras3D] = useState('')
  const [extras, setExtras] = useState([])

  const [potencia3D, setPotencia3D] = useState('150')
  const [costoKwh3D, setCostoKwh3D] = useState('100')
  const [factorFalla3D, setFactorFalla3D] = useState('10') // Porcentaje puro (10%)
  const [margenGanancia3D, setMargenGanancia3D] = useState('200') // Porcentaje de ganancia (200%)

  const [desgasteMaquina3D, setDesgasteMaquina3D] = useState('300') // $/hora (nozzle, cama, mantenimiento)
  const [precioHoraManoObra3D, setPrecioHoraManoObra3D] = useState('3000') // $/hora
  const [tiempoPreparacion3D, setTiempoPreparacion3D] = useState('') // hs en el slicer / nivelado
  const [tiempoPostProcesado3D, setTiempoPostProcesado3D] = useState('') // hs sacando soportes, lijando, pintando

  // 2. FÓRMULAS EXACTAS (Ajustadas para leer porcentajes puros)
  const precioRollo = parseFloat(precioRollo3D) || 0
  const pesoPieza = parseFloat(gramos3D) || 0
  const tiempoImpresion = parseFloat(horas3D) || 0
  const potencia = parseFloat(potencia3D) || 0
  const costoKwh = parseFloat(costoKwh3D) || 0

  const fallaPorcentaje = parseFloat(factorFalla3D) || 0
  const multiplicadorFalla = 1 + fallaPorcentaje / 100

  const margenPorcentaje = parseFloat(margenGanancia3D) || 0

  const costoPorGramo = precioRollo / 1000
  const costoMaterial3D = pesoPieza * costoPorGramo
  const costoLuz3D = ((potencia * tiempoImpresion) / 1000) * costoKwh

  const costoDesgasteMaquina3D = (parseFloat(desgasteMaquina3D) || 0) * tiempoImpresion

  const precioHoraManoObra = parseFloat(precioHoraManoObra3D) || 0
  const tiempoManoObra =
    (parseFloat(tiempoPreparacion3D) || 0) + (parseFloat(tiempoPostProcesado3D) || 0)
  const costoManoObra3D = precioHoraManoObra * tiempoManoObra

  const costoExtrasTotal = extras.reduce((acc, f) => acc + (parseFloat(f.monto) || 0), 0)
  const costoBaseFab3D =
    (costoMaterial3D + costoLuz3D + costoDesgasteMaquina3D + costoExtrasTotal) *
      multiplicadorFalla +
    costoManoObra3D
  const gananciaNeta3D = costoBaseFab3D * (margenPorcentaje / 100)
  const precioSugerido3D = costoBaseFab3D + gananciaNeta3D

  const handleGuardar = () => {
    if (!producto || !cliente)
      return showToast('Por favor, ingresá el Nombre del Producto y el Cliente.', 'error')

    agregarVenta({
      titulo: producto,
      cliente,
      tipo: tipoActual,
      estado: estadoTrabajo,
      costo: Math.round(costoBaseFab3D),
      ganancia: Math.round(precioSugerido3D) - Math.round(costoBaseFab3D),
      totalCobrado: Math.round(precioSugerido3D),
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
    setGramos3D('')
    setHoras3D('')
    setExtras([])
    setTiempoPreparacion3D('')
    setTiempoPostProcesado3D('')
  }

  return (
    <div className="calculadora-container">
      <datalist id="lista-clientes-guardados">
        {clientes.map((c) => (
          <option key={c.id} value={c.nombre} />
        ))}
      </datalist>

      {/* FORMULARIO */}
      <div className="glass-panel panel-formulario" style={{ overflowY: 'auto' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3
            className="d-flex align-items-center gap-2 m-0"
            style={{ color: 'var(--color-warning)' }}
          >
            <Settings size={20} /> Datos de Impresión 3D
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
            <label className="form-label text-primary">Pieza a Entregar</label>
            <input
              type="text"
              className="form-control input-dark"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
            />
          </div>

          <div className="col-12 mt-4">
            <SeccionFormulario icon={Boxes} title="Variables de Fabricación">
              <div className="grid-inputs">
                <SelectorMaterial
                  inventario={inventario}
                  materialId={materialId}
                  setMaterialId={setMaterialId}
                  onSeleccionar={(item) => setPrecioRollo3D(item.costo)}
                />
                <div className="campo-full">
                  <label className="form-label">Precio del Rollo x 1KG ($)</label>
                  <input
                    type="number"
                    className="form-control input-dark"
                    value={precioRollo3D}
                    onChange={(e) => setPrecioRollo3D(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Peso Total de la Pieza (gr)</label>
                  <input
                    type="number"
                    className="form-control input-dark border-success"
                    placeholder="Ej: 150"
                    value={gramos3D}
                    onChange={(e) => setGramos3D(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Tiempo de Impresión (hs)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control input-dark border-success"
                    placeholder="Ej: 4.5"
                    value={horas3D}
                    onChange={(e) => setHoras3D(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label small">Potencia (W)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm input-dark"
                    value={potencia3D}
                    onChange={(e) => setPotencia3D(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label small">Luz (ARS/kWh)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm input-dark"
                    value={costoKwh3D}
                    onChange={(e) => setCostoKwh3D(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label small">Falla (%)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm input-dark"
                    placeholder="10"
                    value={factorFalla3D}
                    onChange={(e) => setFactorFalla3D(e.target.value)}
                  />
                </div>
                <ListaExtras inventario={inventario} extras={extras} setExtras={setExtras} />
              </div>
            </SeccionFormulario>
          </div>

          <div className="col-12 mt-4">
            <SeccionFormulario icon={Gauge} title="Máquina y Mano de Obra">
              <div className="grid-inputs">
                <div>
                  <label className="form-label small">Desgaste Máquina ($/hs)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm input-dark"
                    value={desgasteMaquina3D}
                    onChange={(e) => setDesgasteMaquina3D(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label small">Valor Hora Mano de Obra ($)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm input-dark"
                    value={precioHoraManoObra3D}
                    onChange={(e) => setPrecioHoraManoObra3D(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label small">Hs Preparación (slicer)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control form-control-sm input-dark"
                    placeholder="Ej: 0.5"
                    value={tiempoPreparacion3D}
                    onChange={(e) => setTiempoPreparacion3D(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label small">Hs Post-Procesado</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control form-control-sm input-dark"
                    placeholder="Ej: 0.5"
                    value={tiempoPostProcesado3D}
                    onChange={(e) => setTiempoPostProcesado3D(e.target.value)}
                  />
                </div>
              </div>
            </SeccionFormulario>
          </div>

          <div className="col-md-6 mt-3">
            <label className="form-label text-success">Margen Ganancia (%)</label>
            <input
              type="number"
              className="form-control input-dark"
              value={margenGanancia3D}
              onChange={(e) => setMargenGanancia3D(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TICKET DE SALIDA */}
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
            <span>Costo por Gramo:</span>
            <span>${costoPorGramo.toFixed(2)}</span>
          </div>
          <div className="ticket-item">
            <span>Gasto de Filamento ({pesoPieza}g):</span>
            <span>{formatearPesos(costoMaterial3D)}</span>
          </div>
          <div className="ticket-item">
            <span>Gasto de Electricidad ({tiempoImpresion}hs):</span>
            <span>{formatearPesos(costoLuz3D)}</span>
          </div>
          <div className="ticket-item">
            <span>Desgaste de Máquina ({tiempoImpresion}hs):</span>
            <span>{formatearPesos(costoDesgasteMaquina3D)}</span>
          </div>
          <div className="ticket-item">
            <span>Extras (Pintura, Lijas, etc.):</span>
            <span>{formatearPesos(costoExtrasTotal)}</span>
          </div>
          <div className="ticket-item">
            <span>Mano de Obra ({tiempoManoObra}hs):</span>
            <span>{formatearPesos(costoManoObra3D)}</span>
          </div>
          <div className="ticket-item mt-3 border-0">
            <span className="text-info">COSTO BASE (+{fallaPorcentaje}% falla):</span>
            <span className="text-info fw-bold">{formatearPesos(costoBaseFab3D)}</span>
          </div>
          <div className="ticket-item border-0">
            <span className="text-warning">Ganancia (+{margenPorcentaje}%):</span>
            <span className="text-warning">+ {formatearPesos(gananciaNeta3D)}</span>
          </div>
          <div className="ticket-total">
            <span>PRECIO VENTA:</span>
            <span>{formatearPesos(precioSugerido3D)}</span>
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
