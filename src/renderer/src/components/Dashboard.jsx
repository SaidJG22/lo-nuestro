import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'
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
import { CHART_COLORS, CHART_TOOLTIP_STYLE } from '../utils/chartTheme'
import {
  agruparGananciasPorDia,
  agruparGananciasPorMes,
  agruparGananciasPorTipo,
  gananciaDeHoy,
  gananciaDelMes,
  etiquetaHoy,
  etiquetaMesActual
} from '../utils/ganancias'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const {
    ventas,
    inventario,
    clientes,
    tiposTrabajo,
    categoriasInventario,
    resetearVentas,
    restaurarBackup
  } = useStore()
  const confirmar = useConfirm()
  const showToast = useToast()
  const [reseteando, setReseteando] = useState(false)
  const [procesandoBackup, setProcesandoBackup] = useState(false)
  const [vistaPeriodo, setVistaPeriodo] = useState('dia')

  const totalCobrado = ventas.reduce((acc, venta) => acc + venta.totalCobrado, 0)
  const costoTotal = ventas.reduce((acc, venta) => acc + venta.costo, 0)
  const gananciaNeta = ventas.reduce((acc, venta) => acc + venta.ganancia, 0)

  const gananciasPorDia = useMemo(() => agruparGananciasPorDia(ventas), [ventas])
  const gananciasPorMes = useMemo(() => agruparGananciasPorMes(ventas), [ventas])
  const gananciasPorTipo = useMemo(() => agruparGananciasPorTipo(ventas), [ventas])
  const hoyTotal = useMemo(() => gananciaDeHoy(ventas), [ventas])
  const mesTotal = useMemo(() => gananciaDelMes(ventas), [ventas])

  const datosPeriodo = vistaPeriodo === 'dia' ? gananciasPorDia : gananciasPorMes
  const datosGrafico = datosPeriodo.slice(vistaPeriodo === 'dia' ? -14 : -12)
  const datosTabla = [...datosPeriodo].reverse()

  const datosTorta = [
    { name: 'Costos (Insumos, Luz, Flete)', value: costoTotal },
    { name: 'Ganancia Limpia', value: gananciaNeta }
  ]
  const coloresTorta = [CHART_COLORS.danger, CHART_COLORS.accent]

  const ultimasVentas = ventas.slice(-5).map((v) => ({
    nombre: v.titulo.substring(0, 10) + (v.titulo.length > 10 ? '...' : ''),
    ganancia: v.ganancia,
    costo: v.costo
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

  const handleExportarBackup = async () => {
    setProcesandoBackup(true)
    try {
      const datos = {
        ventas,
        inventario,
        clientes,
        tiposTrabajo,
        categoriasInventario,
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
        <div className="glass-panel tarjeta-stat">
          <div className="tarjeta-stat-icon tarjeta-stat-icon-info">
            <Wallet size={20} />
          </div>
          <h4 className="tarjeta-stat-label">Facturación Bruta</h4>
          <p className="tarjeta-stat-valor" style={{ color: 'var(--color-info)' }}>
            ${totalCobrado.toFixed(2)}
          </p>
        </div>
        <div className="glass-panel tarjeta-stat">
          <div className="tarjeta-stat-icon tarjeta-stat-icon-danger">
            <TrendingDown size={20} />
          </div>
          <h4 className="tarjeta-stat-label">Costos Operativos</h4>
          <p className="tarjeta-stat-valor" style={{ color: 'var(--color-danger)' }}>
            ${costoTotal.toFixed(2)}
          </p>
        </div>
        <div className="glass-panel tarjeta-stat tarjeta-stat-destacada">
          <div className="tarjeta-stat-icon tarjeta-stat-icon-accent">
            <TrendingUp size={20} />
          </div>
          <h4 className="tarjeta-stat-label">Ganancia Neta</h4>
          <p
            className="tarjeta-stat-valor tarjeta-stat-valor-glow"
            style={{ color: 'var(--color-accent)' }}
          >
            ${gananciaNeta.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="graficos-container">
        <div className="glass-panel grafico-caja">
          <h4 className="grafico-titulo">
            <PieChartIcon size={18} /> Distribución del Dinero
          </h4>
          {ventas.length === 0 ? (
            <p className="text-center mt-5" style={{ color: 'var(--color-text-muted)' }}>
              Guarda un trabajo para ver los gráficos.
            </p>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={datosTorta}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {datosTorta.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={coloresTorta[index % coloresTorta.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="glass-panel grafico-caja">
          <h4 className="grafico-titulo">
            <TrendingUp size={18} /> Últimos 5 Trabajos
          </h4>
          {ventas.length === 0 ? (
            <p className="text-center mt-5" style={{ color: 'var(--color-text-muted)' }}>
              Esperando datos...
            </p>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={ultimasVentas}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.border}
                    vertical={false}
                  />
                  <XAxis dataKey="nombre" stroke={CHART_COLORS.textMuted} />
                  <YAxis stroke={CHART_COLORS.textMuted} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar
                    dataKey="ganancia"
                    name="Ganancia Neta"
                    fill={CHART_COLORS.accent}
                    stackId="a"
                  />
                  <Bar dataKey="costo" name="Costos" fill={CHART_COLORS.danger} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel grafico-caja">
        <h4 className="grafico-titulo">
          <Layers size={18} /> Ganancia por Tipo de Trabajo
        </h4>
        {ventas.length === 0 ? (
          <p className="text-center mt-5" style={{ color: 'var(--color-text-muted)' }}>
            Guarda un trabajo para ver este gráfico.
          </p>
        ) : (
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={gananciasPorTipo}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_COLORS.border}
                  vertical={false}
                />
                <XAxis dataKey="tipo" stroke={CHART_COLORS.textMuted} tick={{ fontSize: 11 }} />
                <YAxis stroke={CHART_COLORS.textMuted} />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
                <Bar
                  dataKey="ganancia"
                  name="Ganancia Neta"
                  fill={CHART_COLORS.accent}
                  stackId="a"
                />
                <Bar dataKey="costo" name="Costos" fill={CHART_COLORS.danger} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="glass-panel seccion-ganancias-periodo">
        <div className="periodo-header">
          <h4 className="grafico-titulo periodo-titulo">
            <CalendarDays size={18} /> Ganancias por Período
          </h4>
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
        </div>

        <div className="mini-tarjetas-periodo">
          <div className="mini-tarjeta-periodo">
            <h5 className="mini-tarjeta-periodo-label">
              Ganancia de Hoy <span>({etiquetaHoy()})</span>
            </h5>
            <p className="mini-tarjeta-periodo-valor" style={{ color: 'var(--color-accent)' }}>
              ${hoyTotal.toFixed(2)}
            </p>
          </div>
          <div className="mini-tarjeta-periodo">
            <h5 className="mini-tarjeta-periodo-label">
              Ganancia de Este Mes <span>({etiquetaMesActual()})</span>
            </h5>
            <p className="mini-tarjeta-periodo-valor" style={{ color: 'var(--color-accent)' }}>
              ${mesTotal.toFixed(2)}
            </p>
          </div>
        </div>

        {ventas.length === 0 ? (
          <p className="text-center mt-5" style={{ color: 'var(--color-text-muted)' }}>
            Guarda un trabajo para ver las ganancias por período.
          </p>
        ) : (
          <div className="periodo-contenido">
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={datosGrafico}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.border}
                    vertical={false}
                  />
                  <XAxis dataKey="label" stroke={CHART_COLORS.textMuted} tick={{ fontSize: 11 }} />
                  <YAxis stroke={CHART_COLORS.textMuted} />
                  <Tooltip
                    contentStyle={CHART_TOOLTIP_STYLE}
                    formatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Bar
                    dataKey="ganancia"
                    name="Ganancia"
                    fill={CHART_COLORS.accent}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="tabla-ganancias-wrapper">
              <table className="tabla-ganancias">
                <thead>
                  <tr>
                    <th>{vistaPeriodo === 'dia' ? 'Fecha' : 'Mes'}</th>
                    <th>Ganancia</th>
                    <th>Trabajos</th>
                  </tr>
                </thead>
                <tbody>
                  {datosTabla.map((fila) => (
                    <tr key={fila.clave}>
                      <td>{fila.label}</td>
                      <td className="tabla-ganancias-valor">${fila.ganancia.toFixed(2)}</td>
                      <td>{fila.cantidad}</td>
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
