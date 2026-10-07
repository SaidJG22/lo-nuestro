import '../../styles/Graficos.css'

// Leyenda en HTML: la muestra de color identifica, el texto va en tinta.
// forma 'rect' para barras/áreas, 'linea' para líneas.
export default function LeyendaGrafico({ items }) {
  return (
    <ul className="leyenda-grafico">
      {items.map(({ nombre, color, forma = 'rect' }) => (
        <li key={nombre}>
          <span
            className={`leyenda-grafico-muestra ${forma === 'linea' ? 'es-linea' : ''}`}
            style={{ background: color }}
          />
          {nombre}
        </li>
      ))}
    </ul>
  )
}
