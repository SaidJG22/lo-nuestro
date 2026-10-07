import { useId } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import TooltipGrafico from './TooltipGrafico'
import { marcasRedondas } from './escalas'
import { formatearPesosCompacto } from '../../utils/formato'
import '../../styles/Graficos.css'

// Tendencia de ganancia en el tiempo: línea suave con lavado degradé,
// mira vertical al pasar el mouse y el pico rotulado.
export default function GraficoPeriodo({ datos, colores, alto = 280 }) {
  const idGradiente = `periodo-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const indicePico = datos.reduce(
    (mejor, d, i) => (d.ganancia > (datos[mejor]?.ganancia ?? -Infinity) ? i : mejor),
    0
  )
  const hayPico = datos[indicePico]?.ganancia > 0
  const marcasY = marcasRedondas(datos[indicePico]?.ganancia ?? 0)

  const etiquetaPico = ({ x, y, index, value }) =>
    hayPico && index === indicePico ? (
      <text
        key={index}
        x={x}
        y={y - 14}
        textAnchor={index === datos.length - 1 ? 'end' : index === 0 ? 'start' : 'middle'}
        fill={colores.texto}
        fontSize={12}
        fontWeight={600}
      >
        {formatearPesosCompacto(value)}
      </text>
    ) : (
      <g key={index} />
    )

  const puntoPico = ({ cx, cy, index }) =>
    hayPico && index === indicePico ? (
      <circle
        key={index}
        cx={cx}
        cy={cy}
        r={4.5}
        fill={colores.ganancia}
        stroke={colores.superficie}
        strokeWidth={2}
      />
    ) : (
      <g key={index} />
    )

  return (
    <ResponsiveContainer width="100%" height={alto}>
      <AreaChart data={datos} margin={{ top: 28, right: 16, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={idGradiente} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colores.ganancia} stopOpacity={0.3} />
            <stop offset="60%" stopColor={colores.ganancia} stopOpacity={0.1} />
            <stop offset="100%" stopColor={colores.ganancia} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={colores.grid} />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: colores.textMuted, fontSize: 11 }}
          interval="preserveStartEnd"
          minTickGap={14}
          tickMargin={8}
        />
        <YAxis
          ticks={marcasY}
          domain={[0, marcasY[marcasY.length - 1]]}
          tickFormatter={formatearPesosCompacto}
          axisLine={false}
          tickLine={false}
          width={58}
          tick={{ fill: colores.textMuted, fontSize: 11 }}
        />
        <Tooltip
          cursor={{ stroke: colores.textMuted, strokeOpacity: 0.45, strokeWidth: 1 }}
          content={
            <TooltipGrafico
              colores={colores}
              pie={(d) => (d.cantidad === 1 ? '1 trabajo' : `${d.cantidad} trabajos`)}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="ganancia"
          name="Ganancia"
          stroke={colores.ganancia}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={`url(#${idGradiente})`}
          fillOpacity={1}
          dot={puntoPico}
          label={etiquetaPico}
          activeDot={{
            r: 5.5,
            fill: colores.ganancia,
            stroke: colores.superficie,
            strokeWidth: 2.5
          }}
          animationDuration={1300}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
