import { AlertTriangle } from 'lucide-react'

export default function SelectorMaterial({ inventario, materialId, setMaterialId, onSeleccionar }) {
  const handleChange = (e) => {
    const id = e.target.value
    setMaterialId(id)
    if (id === '') return
    const item = inventario.find((m) => String(m.id) === id)
    if (item) onSeleccionar(item)
  }

  const itemSeleccionado = inventario.find((m) => String(m.id) === materialId)
  const stockBajo = itemSeleccionado && itemSeleccionado.stock <= itemSeleccionado.stockMinimo

  return (
    <div className="campo-full">
      <label className="form-label text-info">Material del Inventario</label>
      <select className="form-select input-dark" value={materialId} onChange={handleChange}>
        <option value="">Cargar precio manualmente...</option>
        {inventario.map((item) => (
          <option key={item.id} value={item.id}>
            {item.nombre} — {item.stock} en stock (${item.costo})
          </option>
        ))}
      </select>
      {stockBajo && (
        <span
          className="d-flex align-items-center gap-1 mt-1 small"
          style={{ color: 'var(--color-danger)' }}
        >
          <AlertTriangle size={12} /> Quedan {itemSeleccionado.stock} unidades, por debajo del
          mínimo ({itemSeleccionado.stockMinimo}).
        </span>
      )}
    </div>
  )
}
