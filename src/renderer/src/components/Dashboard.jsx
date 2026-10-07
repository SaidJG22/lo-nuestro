import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import {
  BarChart3,
  Trash2,
  PieChart as PieChartIcon,
  TrendingUp,
  Wallet,
  TrendingDown,
  CalendarDays,
  Download,
  Upload,
  Layers
} from 'lucide-react'
import { useConfirm } from './ui/ConfirmModal'
import { useToast } from './ui/ToastProvider'
import { getChartColors } from '../utils/chartTheme'
import {
  agruparGananciasPorDia,
  agruparGananciasPorMes,
  agruparGananciasPorTipo,
  gananciaDeHoy,
  gananciaDelMes,
  idsDelPeriodo,
  etiquetaHoy,
  etiquetaMesActual,
  serieContinuaPorDia,
  serieContinuaPorMes
} from '../utils/ganancias'
import { formatearPesos } from '../utils/formato'
import GraficoDistribucion from './graficos/GraficoDistribucion'
import GraficoBarrasApiladas from './graficos/GraficoBarrasApiladas'
import GraficoPeriodo from './graficos/GraficoPeriodo'
import Sparkline from './graficos/Sparkline'
import { useContador } from './graficos/useContador'
import '../styles/Dashboard.css'

// Número que "cuenta" hasta su valor al aparecer o cambiar.
function MontoAnimado({ valor, className }) {
  const mostrado = useContador(valor)
  return <p className={className}>{formatearPesos(mostrado)}</p>
}

export default function Dashboard() {
  const {
    ventas,
    inventario,
    clientes,
    tiposTrabajo,
    categoriasInventario,
    resetearVentas,
    eliminarVentas,
    restaurarBackup,
    movimientosStock,
    tema
  } = useStore()
  const confirmar = useConfirm()
  const showToast = useToast()
  const [reseteando, setReseteando] = useState(false)
  const [procesandoBackup, setProcesandoBackup] = useState(false)
  const [vistaPeriodo, setVistaPeriodo] = useState('dia')

  const colores = getChartColors(tema)

  const totalCobrado = ventas.reduce((acc, venta) => acc + venta.totalCobrado, 0)
  const costoTotal = ventas.reduce((acc, venta) => acc + venta.costo, 0)
  const gananciaNeta = ventas.reduce((acc, venta) => acc + venta.ganancia, 0)

  const gananciasPorDia = useMemo(() => agruparGananciasPorDia(ventas), [ventas])
  const gananciasPorMes = useMemo(() => agruparGananciasPorMes(ventas), [ventas])
  const gananciasPorTipo = useMemo(() => agruparGananciasPorTipo(ventas), [ventas])
  const hoyTotal = useMemo(() => gananciaDeHoy(ventas), [ventas])
  const mesTotal = useMemo(() => gananciaDelMes(ventas), [ventas])

  // Tendencia de los últimos 14 días para las tarjetas de resumen
  const tendencia = useMemo(
    () =>
      serieContinuaPorDia(ventas, 14).map((d) => ({ ...d, totalCobrado: d.costo + d.ganancia })),
    [ventas]
  )

  const datosPeriodo = vistaPeriodo === 'dia' ? gananciasPorDia : gananciasPorMes
  const datosGrafico = useMemo(
    () =>
      vistaPeriodo === 'dia' ? serieContinuaPorDia(ventas, 14) : serieContinuaPorMes(ventas, 12),
    [ventas, vistaPeriodo]
  )
  const datosTabla = [...datosPeriodo].reverse()

  const ultimasVentas = ventas
    .slice(-5)
    .reverse()
    .map((v) => ({ nombre: v.titulo || 'Sin título', ganancia: v.ganancia, costo: v.costo }))
  const datosPorTipo = gananciasPorTipo.map((t) => ({
    nombre: t.tipo,
    ganancia: t.ganancia,
    costo: t.costo
  }))

  const handleReset = async () => {
    setReseteando(true)
    const ok = await confirmar(
      'Esto no borrará tus clientes ni tu inventario, solo el historial de ventas y gráficos.',
      { title: 'Borrar historial de ventas', danger: true }
    )
    setReseteando(false)
    if (ok) resetearVentas()
  }

  const handleBorrarPeriodo = async (fila) => {
    const ids = idsDelPeriodo(ventas, fila.clave, vistaPeriodo)
    const ok = await confirmar(
      `Se eliminarán ${ids.length} trabajo${ids.length === 1 ? '' : 's'} de ${fila.label}. También desaparecen del tablero de Clientes.`,
      { title: 'Borrar período', danger: true }
    )
    if (!ok) return
    eliminarVentas(ids)
    showToast(`Trabajos de ${fila.label} eliminados.`, 'success')
  }

  const handleExportarBackup = async () => {
    setProcesandoBackup(true)
    try {
      const datos = {
        ventas,
        inventario,
        clientes,
        tiposTrabajo,
        categoriasInventario,
        movimientosStock,
        exportadoEl: new Date().toISOString()
      }
      const resultado = await window.api.exportarBackup(JSON.stringify(datos, null, 2))
      if (resultado.ok) showToast('Backup exportado correctamente.', 'success')
    } finally {
      setProcesandoBackup(false)
    }
  }

  const handleImportarBackup = async () => {
    const ok = await confirmar(
      'Esto reemplazará todos los datos actuales (ventas, clientes e inventario) por los del archivo elegido.',
      { title: 'Importar backup', danger: true }
    )
    if (!ok) return

    setProcesandoBackup(true)
    try {
      const resultado = await window.api.importarBackup()
      if (!resultado.ok) return
      const datos = JSON.parse(resultado.contenido)
      restaurarBackup(datos)
      showToast('Backup importado correctamente.', 'success')
    } catch {
      showToast('El archivo elegido no es un backup válido.', 'error')
    } finally {
      setProcesandoBackup(false)
    }
  }

  return (
    <div className="dashboard-container fade-in">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="d-flex align-items-center gap-2 m-0" style={{ color: 'var(--color-info)' }}>
          <BarChart3 size={24} /> Panel de Control
        </h2>
        <div className="d-flex gap-2">
          <button
            className="btn-reset"
            style={{ borderColor: 'var(--color-info)', color: 'var(--color-info)' }}
            onClick={handleExportarBackup}
            disabled={procesandoBackup}
          >
            <Download size={16} /> Exportar Backup
          </button>
          <button
            className="btn-reset"
            style={{ borderColor: 'var(--color-info)', color: 'var(--color-info)' }}
            onClick={handleImportarBackup}
            disabled={procesandoBackup}
          >
            <Upload size={16} /> Importar Backup
          </button>
          <button className="btn-reset" onClick={handleReset} disabled={reseteando}>
            <Trash2 size={16} /> Resetear Gráficos e Historial
          </button>
        </div>
      </div>

      <div className="resumen-tarjetas">
        {[
          {
            clave: 'totalCobrado',
            titulo: 'Facturación bruta',
            valor: totalCobrado,
            icono: Wallet,
            color: colores.facturacion,
            variante: 'facturacion'
          },
          {
            clave: 'costo',
            titulo: 'Costos operativos',
            valor: costoTotal,
            icono: TrendingDown,
            color: colores.costo,
            variante: 'costo'
          },
          {
            clave: 'ganancia',
            titulo: 'Ganancia neta',
            valor: gananciaNeta,
            icono: TrendingUp,
            color: colores.ganancia,
            variante: 'ganancia'
          }
        ].map(({ clave, titulo, valor, icono: Icono, color, variante }) => (
          <div
            key={clave}
            className={`glass-panel tarjeta-stat tarjeta-stat-${variante}${
              variante === 'ganancia' ? ' tarjeta-stat-destacada' : ''
            }`}
          >
            <div className="tarjeta-stat-cabecera">
              <div className="tarjeta-stat-icon">
                <Icono size={18} />
              </div>
              <h4 className="tarjeta-stat-label">{titulo}</h4>
            </div>
            <MontoAnimado valor={valor} className="tarjeta-stat-valor" />
            <Sparkline
              datos={tendencia}
              clave={clave}
              color={color}
              superficie={colores.superficie}
            />
            <span className="tarjeta-stat-pie">Últimos 14 días</span>
          </div>
        ))}
      </div>

      <div className="graficos-container">
        <div className="glass-panel grafico-caja">
          <div className="grafico-encabezado">
            <h4 className="grafico-titulo">
              <PieChartIcon size={18} /> Distribución del dinero
            </h4>
            <span className="grafico-subtitulo">A dónde va cada peso cobrado</span>
          </div>
          {ventas.length === 0 ? (
            <p className="grafico-vacio">Guardá un trabajo para ver los gráficos.</p>
          ) : (
            <GraficoDistribucion costo={costoTotal} ganancia={gananciaNeta} colores={colores} />
          )}
        </div>

        <div className="glass-panel grafico-caja">
          <div className="grafico-encabezado">
            <h4 className="grafico-titulo">
              <TrendingUp size={18} /> Últimos 5 trabajos
            </h4>
            <span className="grafico-subtitulo">
              Costo y ganancia de cada uno, el más reciente arriba
            </span>
          </div>
          {ventas.length === 0 ? (
            <p className="grafico-vacio">Esperando datos…</p>
          ) : (
            <GraficoBarrasApiladas datos={ultimasVentas} colores={colores} />
          )}
        </div>
      </div>

      <div className="glass-panel grafico-caja">
        <div className="grafico-encabezado">
          <h4 className="grafico-titulo">
            <Layers size={18} /> Ganancia por tipo de trabajo
          </h4>
          <span className="grafico-subtitulo">Ordenado de mayor a menor ganancia</span>
        </div>
        {ventas.length === 0 ? (
          <p className="grafico-vacio">Guardá un trabajo para ver este gráfico.</p>
        ) : (
          <GraficoBarrasApiladas datos={datosPorTipo} colores={colores} />
        )}
      </div>

      <div className="glass-panel seccion-ganancias-periodo">
        <div className="periodo-header">
          <h4 className="grafico-titulo periodo-titulo">
            <CalendarDays size={18} /> Ganancias por Período
          </h4>
          <div className="d-flex align-items-center gap-2">
            <div className="toggle-periodo">
              <button
                className={`toggle-periodo-btn ${vistaPeriodo === 'dia' ? 'activo' : ''}`}
                onClick={() => setVistaPeriodo('dia')}
              >
                Diario
              </button>
              <button
                className={`toggle-periodo-btn ${vistaPeriodo === 'mes' ? 'activo' : ''}`}
                onClick={() => setVistaPeriodo('mes')}
              >
                Mensual
              </button>
            </div>
            {ventas.length > 0 && (
              <button className="btn-reset" onClick={handleReset} disabled={reseteando}>
                <Trash2 size={14} /> Borrar historial
              </button>
            )}
          </div>
        </div>

        <div className="mini-tarjetas-periodo">
          <div className="mini-tarjeta-periodo">
            <h5 className="mini-tarjeta-periodo-label">
              Ganancia de Hoy <span>({etiquetaHoy()})</span>
            </h5>
            <MontoAnimado valor={hoyTotal} className="mini-tarjeta-periodo-valor" />
          </div>
          <div className="mini-tarjeta-periodo">
            <h5 className="mini-tarjeta-periodo-label">
              Ganancia de Este Mes <span>({etiquetaMesActual()})</span>
            </h5>
            <MontoAnimado valor={mesTotal} className="mini-tarjeta-periodo-valor" />
          </div>
        </div>

        {ventas.length === 0 ? (
          <p className="text-center mt-5" style={{ color: 'var(--color-text-muted)' }}>
            Guarda un trabajo para ver las ganancias por período.
          </p>
        ) : (
          <div className="periodo-contenido">
            <div className="periodo-grafico">
              <span className="grafico-subtitulo">
                {vistaPeriodo === 'dia' ? 'Últimos 14 días' : 'Últimos 12 meses'}
              </span>
              <GraficoPeriodo key={vistaPeriodo} datos={datosGrafico} colores={colores} />
            </div>

            <div className="tabla-ganancias-wrapper">
              <table className="tabla-ganancias">
                <thead>
                  <tr>
                    <th>{vistaPeriodo === 'dia' ? 'Fecha' : 'Mes'}</th>
                    <th>Ganancia</th>
                    <th>Trabajos</th>
                    <th aria-label="Acciones" />
                  </tr>
                </thead>
                <tbody>
                  {datosTabla.map((fila) => (
                    <tr key={fila.clave}>
                      <td>{fila.label}</td>
                      <td className="tabla-ganancias-valor">{formatearPesos(fila.ganancia)}</td>
                      <td>{fila.cantidad}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-icono btn-icono-danger"
                          aria-label={`Borrar trabajos de ${fila.label}`}
                          onClick={() => handleBorrarPeriodo(fila)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
