// Paleta y estilos compartidos para los gráficos de Recharts.
// Recharts no resuelve var(--token) de forma confiable en atributos SVG,
// así que se replican los valores hex de tokens.css aquí, por tema.
const CHART_COLORS_DARK = {
  accent: '#22c55e',
  danger: '#ef4444',
  info: '#38bdf8',
  textMuted: '#94a3b8',
  border: '#334155'
}

const CHART_COLORS_LIGHT = {
  accent: '#16a34a',
  danger: '#dc2626',
  info: '#0284c7',
  textMuted: '#475569',
  border: '#cbd5e1'
}

const CHART_TOOLTIP_STYLE_DARK = {
  backgroundColor: '#0e1223',
  borderColor: '#334155',
  borderRadius: 10,
  color: '#f8fafc',
  fontFamily: 'Inter, system-ui, sans-serif'
}

const CHART_TOOLTIP_STYLE_LIGHT = {
  backgroundColor: '#ffffff',
  borderColor: '#cbd5e1',
  borderRadius: 10,
  color: '#0f172a',
  fontFamily: 'Inter, system-ui, sans-serif'
}

export function getChartColors(tema) {
  return tema === 'light' ? CHART_COLORS_LIGHT : CHART_COLORS_DARK
}

export function getChartTooltipStyle(tema) {
  return tema === 'light' ? CHART_TOOLTIP_STYLE_LIGHT : CHART_TOOLTIP_STYLE_DARK
}
