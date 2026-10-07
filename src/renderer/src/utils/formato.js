export function formatearPesos(monto) {
  return `$${Math.round(monto || 0).toLocaleString('es-AR')}`
}

const compacto = new Intl.NumberFormat('es-AR', { notation: 'compact', maximumFractionDigits: 1 })

// Para ejes y etiquetas de gráficos: $950 · $12 k · $1,3 M
export function formatearPesosCompacto(monto) {
  return `$${compacto.format(Math.round(monto || 0))}`
}
