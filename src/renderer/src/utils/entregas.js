const DIAS_POR_VENCER = 2
const MS_POR_DIA = 24 * 60 * 60 * 1000

// Parsea 'YYYY-MM-DD' como fecha local: new Date('YYYY-MM-DD') la toma como UTC y en Argentina corre un día.
const parsearFechaLocal = (fecha) => {
  const [y, m, d] = fecha.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function estadoEntrega(fechaEntrega, estado) {
  if (!fechaEntrega || estado === 'Terminado') return null
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const dias = Math.round((parsearFechaLocal(fechaEntrega) - hoy) / MS_POR_DIA)
  if (dias < 0) return 'vencido'
  if (dias <= DIAS_POR_VENCER) return 'por-vencer'
  return 'a-tiempo'
}

export function formatearFecha(fecha) {
  if (!fecha) return ''
  const [y, m, d] = fecha.split('-')
  return `${d}/${m}/${y}`
}

export function saldoPendiente(venta) {
  return Math.max(Math.round((venta.totalCobrado || 0) - (venta.sena || 0)), 0)
}
