import { Plus, Trash2 } from 'lucide-react'

export default function ListaExtras({
  inventario,
  extras,
  setExtras,
  label = 'Extras (Pintura, Lijas, etc.)'
}) {
  const agregarFila = () => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setExtras([...extras, { id, materialId: '', descripcion: '', monto: '' }])
  }

  const actualizarFila = (id, cambios) => {
    setExtras(extras.map((f) => (f.id === id ? { ...f, ...cambios } : f)))
  }

  const eliminarFila = (id) => {
    setExtras(extras.filter((f) => f.id !== id))
  }

  const handleMaterialChange = (fila, materialIdSeleccionado) => {
    if (materialIdSeleccionado === '') {
      actualizarFila(fila.id, { materialId: '', descripcion: '' })
      return
    }
    const item = inventario.find((m) => String(m.id) === materialIdSeleccionado)
    actualizarFila(fila.id, {
      materialId: materialIdSeleccionado,
      descripcion: item ? item.nombre : '',
      monto: item ? item.costo : fila.monto
    })
  }

  const total = extras.reduce((acc, f) => acc + (parseFloat(f.monto) || 0), 0)

  return (
    <div className="campo-full">
      <label className="form-label">{label}</label>

      {extras.map((fila) => (
        <div key={fila.id} className="fila-extra">
          <select
            className="form-select form-select-sm input-dark"
            value={fila.materialId}
            onChange={(e) => handleMaterialChange(fila, e.target.value)}
          >
            <option value="">Descripción manual...</option>
            {inventario.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre} — {item.stock} en stock
              </option>
            ))}
          </select>

          {fila.materialId === '' && (
            <input
              type="text"
              className="form-control form-control-sm input-dark"
              placeholder="Ej: Pintura en aerosol"
              value={fila.descripcion}
              onChange={(e) => actualizarFila(fila.id, { descripcion: e.target.value })}
            />
          )}

          <input
            type="number"
            className="form-control form-control-sm input-dark fila-extra-monto"
            placeholder="$"
            value={fila.monto}
            onChange={(e) => actualizarFila(fila.id, { monto: e.target.value })}
          />

          <button
            type="button"
            className="btn-icono btn-icono-danger"
            aria-label="Quitar extra"
            onClick={() => eliminarFila(fila.id)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
        onClick={agregarFila}
      >
        <Plus size={14} /> Agregar Extra
      </button>

      {extras.length > 0 && (
        <p className="fila-extra-total">
          Total Extras: <strong>${total.toFixed(2)}</strong>
        </p>
      )}
    </div>
  )
}
