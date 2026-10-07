import { PieChart, Pie, Cell, Sector, Tooltip, ResponsiveContainer } from 'recharts'
import TooltipGrafico from './TooltipGrafico'
import { useContador } from './useContador'
import { formatearPesos } from '../../utils/formato'
import '../../styles/Graficos.css'

// Sector bajo el puntero: crece unos px hacia afuera.
const sectorActivo = (props) => <Sector {...props} outerRadius={props.outerRadius + 6} />

// Dona "¿a dónde va cada peso cobrado?": el anillo es la facturación,
// el tramo de ganancia es el protagonista y el centro muestra el margen.
export default function GraficoDistribucion({ costo, ganancia, colores }) {
  const total = costo + ganancia
  const margen = total > 0 ? (ganancia / total) * 100 : 0
  const margenAnimado = useContador(margen, 1100)

  const datos = [
    { name: 'Ganancia', clave: 'ganancia', value: Math.max(ganancia, 0) },
    { name: 'Costos', clave: 'costo', value: Math.max(costo, 0) }
  ]
  const porcentaje = (valor) => (total > 0 ? Math.round((valor / total) * 100) : 0)

  return (
    <div className="grafico-distribucion">
      <div className="grafico-distribucion-dona">
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie
              data={datos}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={98}
              startAngle={90}
              endAngle={-270}
              cornerRadius={6}
              stroke={colores.superficie}
              strokeWidth={3}
              activeShape={sectorActivo}
              animationDuration={1100}
              animationEasing="ease-out"
            >
              {datos.map((d) => (
                <Cell key={d.clave} fill={colores[d.clave]} />
              ))}
            </Pie>
            <Tooltip
              wrapperStyle={{ zIndex: 3 }}
              content={
                <TooltipGrafico
                  colores={{ Ganancia: colores.ganancia, Costos: colores.costo }}
                  pie={(d) => `${porcentaje(d.value)}% de lo cobrado`}
                />
              }
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grafico-distribucion-centro" aria-hidden="true">
          <span className="grafico-distribucion-margen">{Math.round(margenAnimado)}%</span>
          <span className="grafico-distribucion-etiqueta">de margen</span>
        </div>
      </div>

      {/* Leyenda con valores: todo se lee sin necesidad de pasar el mouse */}
      <ul className="grafico-distribucion-leyenda">
        {datos.map((d) => (
          <li key={d.clave}>
            <span className="leyenda-grafico-muestra" style={{ background: colores[d.clave] }} />
            <span className="grafico-distribucion-nombre">{d.name}</span>
            <strong>{formatearPesos(d.clave === 'ganancia' ? ganancia : costo)}</strong>
            <span className="grafico-distribucion-porcentaje">{porcentaje(d.value)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
