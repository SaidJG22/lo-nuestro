// Paleta y estilos compartidos para los gráficos de Recharts.
// Recharts no resuelve var(--token) de forma confiable en atributos SVG,
// así que se replican los valores hex de tokens.css aquí.
export const CHART_COLORS = {
  accent: '#22c55e',
  danger: '#ef4444',
  info: '#38bdf8',
  textMuted: '#94a3b8',
  border: '#334155'
}

export const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#0e1223',
  borderColor: '#334155',
  borderRadius: 10,
  color: '#f8fafc',
  fontFamily: 'Inter, system-ui, sans-serif'
}
