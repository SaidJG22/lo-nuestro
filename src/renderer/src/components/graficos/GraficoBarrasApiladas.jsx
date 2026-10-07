import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer
} from 'recharts'
import TooltipGrafico from './TooltipGrafico'
import LeyendaGrafico from './LeyendaGrafico'
import { marcasRedondas } from './escalas'
import { formatearPesosCompacto } from '../../utils/formato'
import '../../styles/Graficos.css'

const ALTO_FILA = 46
const recortar = (texto, max = 28) => (texto.length > max ? `${texto.slice(0, max - 1)}…` : texto)

// Barras horizontales apiladas: costo desde la base, ganancia en la punta
// (redondeada) y el total cobrado rotulado al final de cada barra.
export default function GraficoBarrasApiladas({ datos, colores, anchoEtiquetas = 175 }) {
  const filas = datos.map((d) => ({ ...d, total: d.costo + d.ganancia }))
  const marcasX = marcasRedondas(Math.max(0, ...filas.map((f) => f.total)))
  const alto = filas.length * ALTO_FILA + 36
  const marcaApagada = { fillOpacity: 0.82 }

  return (
    <div className="grafico-barras">
      <LeyendaGrafico
        items={[
          { nombre: 'Costos', color: colores.costo },
          { nombre: 'Ganancia', color: colores.ganancia }
        ]}
      />
      <ResponsiveContainer width="100%" height={alto}>
        <BarChart
          data={filas}
          layout="vertical"
          margin={{ top: 4, right: 56, bottom: 0, left: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid horizontal={false} stroke={colores.grid} />
          <XAxis
            type="number"
            ticks={marcasX}
            domain={[0, marcasX[marcasX.length - 1]]}
            tickFormatter={formatearPesosCompacto}
            axisLine={false}
            tickLine={false}
            tick={{ fill: colores.textMuted, fontSize: 11 }}
          />
          <YAxis
            type="category"
            dataKey="nombre"
            width={anchoEtiquetas}
            tickFormatter={(t) => recortar(t)}
            axisLine={false}
            tickLine={false}
            tick={{ fill: colores.texto, fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: colores.grid, fillOpacity: 0.55 }}
            content={
              <TooltipGrafico
                colores={colores}
                titulo={(d) => d.nombre}
                pie={(d) =>
                  `Cobrado ${formatearPesosCompacto(d.total)} · margen ${
                    d.total > 0 ? Math.round((d.ganancia / d.total) * 100) : 0
                  }%`
                }
              />
            }
          />
          <Bar
            dataKey="costo"
            name="Costos"
            stackId="total"
            fill={colores.costo}
            stroke={colores.superficie}
            strokeWidth={2}
            barSize={20}
            activeBar={marcaApagada}
            animationDuration={800}
            animationEasing="ease-out"
          />
          <Bar
            dataKey="ganancia"
            name="Ganancia"
            stackId="total"
            fill={colores.ganancia}
            stroke={colores.superficie}
            strokeWidth={2}
            radius={[0, 5, 5, 0]}
            barSize={20}
            activeBar={marcaApagada}
            animationBegin={300}
            animationDuration={900}
            animationEasing="ease-out"
          >
            <LabelList
              dataKey="total"
              position="right"
              offset={10}
              formatter={formatearPesosCompacto}
              fill={colores.textMuted}
              fontSize={12}
              fontWeight={600}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
