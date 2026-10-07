import { useId } from 'react'
import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts'

// Mini tendencia para las tarjetas de resumen: línea fina, lavado suave
// y un punto en el último valor (el período actual).
export default function Sparkline({ datos, clave, color, superficie, alto = 44 }) {
  const idGradiente = `spark-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const ultimo = datos.length - 1

  const puntoFinal = ({ cx, cy, index }) =>
    index === ultimo ? (
      <circle key={index} cx={cx} cy={cy} r={4} fill={color} stroke={superficie} strokeWidth={2} />
    ) : (
      <g key={index} />
    )

  return (
    <div className="sparkline" aria-hidden="true">
      <ResponsiveContainer width="100%" height={alto}>
        <AreaChart data={datos} margin={{ top: 6, right: 6, bottom: 4, left: 6 }}>
          <defs>
            <linearGradient id={idGradiente} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={[0, 'dataMax']} />
          <Area
            type="monotone"
            dataKey={clave}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${idGradiente})`}
            fillOpacity={1}
            dot={puntoFinal}
            activeDot={false}
            isAnimationActive
            animationDuration={1400}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
