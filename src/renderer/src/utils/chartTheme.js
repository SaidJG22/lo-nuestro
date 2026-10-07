// Paleta compartida para los gráficos de Recharts.
// Recharts no resuelve var(--token) de forma confiable en atributos SVG,
// así que se replican los valores hex aquí, por tema.
//
// ganancia/costo es un par categórico validado (dataviz validate_palette.js):
// pasa banda de luminosidad, croma, separación para daltonismo (ΔE ≥ 12) y
// contraste contra la superficie de las tarjetas. Si se cambian, volver a validar.
const CHART_COLORS_LIGHT = {
  ganancia: '#3d6626', // oliva profundo: la serie protagonista
  costo: '#c27c4a', // caramelo: madera, contexto
  facturacion: '#8a4b1f', // coñac (marca)
  texto: '#34220e',
  textMuted: '#6b533d',
  grid: '#e7dbc7', // un paso por encima de la superficie
  superficie: '#fbf7f0' // fondo de las tarjetas: gaps y anillos
}

const CHART_COLORS_DARK = {
  ganancia: '#77a05e',
  costo: '#9b5824',
  facturacion: '#dda167',
  texto: '#f3e9da',
  textMuted: '#c5af95',
  grid: '#33251b',
  superficie: '#241911'
}

export function getChartColors(tema) {
  return tema === 'light' ? CHART_COLORS_LIGHT : CHART_COLORS_DARK
}
