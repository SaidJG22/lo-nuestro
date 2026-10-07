import { formatearPesos } from '../../utils/formato'
import '../../styles/Graficos.css'

// Tooltip compartido: el valor manda (fuerte), el nombre de la serie acompaña,
// y cada fila lleva una "llave" de línea con el color de su serie.
export default function TooltipGrafico({ active, payload, label, colores, titulo, pie }) {
  if (!active || !payload?.length) return null

  const datos = payload[0].payload
  const textoTitulo = titulo ? titulo(datos, label) : label

  return (
    <div className="tooltip-grafico">
      {textoTitulo && <p className="tooltip-grafico-titulo">{textoTitulo}</p>}
      <ul className="tooltip-grafico-filas">
        {[...payload].reverse().map((item) => (
          <li key={item.dataKey ?? item.name}>
            <span
              className="tooltip-grafico-llave"
              style={{ background: colores?.[item.dataKey] ?? colores?.[item.name] ?? item.color }}
            />
            <strong>{formatearPesos(item.value)}</strong>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
      {pie && <p className="tooltip-grafico-pie">{pie(datos)}</p>}
    </div>
  )
}
