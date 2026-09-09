import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useConfirm } from './ConfirmModal'

export default function SelectorTipoTrabajo({
  tiposTrabajo,
  tipoActual,
  setTipoActual,
  agregarTipoTrabajo,
  eliminarTipoTrabajo,
  label = 'Categoría / Tipo de Trabajo',
  placeholder = 'Crear nuevo rubro...'
}) {
  const [nuevoTipoInput, setNuevoTipoInput] = useState('')
  const confirmar = useConfirm()

  const handleAgregarTipo = (e) => {
    e.preventDefault()
    if (nuevoTipoInput.trim() !== '') {
      agregarTipoTrabajo(nuevoTipoInput)
      setTipoActual(nuevoTipoInput)
      setNuevoTipoInput('')
    }
  }

  const handleEliminarTipo = async () => {
    const ok = await confirmar(`Se eliminará el rubro "${tipoActual}".`, {
      title: 'Borrar tipo de trabajo',
      danger: true
    })
    if (ok) {
      eliminarTipoTrabajo(tipoActual)
      setTipoActual(tiposTrabajo[0] || '')
    }
  }

  return (
    <div className="campo-full">
      <label className="form-label">{label}</label>
      <div className="d-flex gap-2 mb-2">
        <select
          className="form-select input-dark text-warning fw-bold"
          value={tipoActual}
          onChange={(e) => setTipoActual(e.target.value)}
        >
          {tiposTrabajo.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-outline-danger"
          aria-label="Borrar tipo de trabajo"
          onClick={handleEliminarTipo}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <form onSubmit={handleAgregarTipo} className="d-flex gap-2">
        <input
          type="text"
          className="form-control form-control-sm input-dark"
          placeholder={placeholder}
          value={nuevoTipoInput}
          onChange={(e) => setNuevoTipoInput(e.target.value)}
        />
        <button type="submit" className="btn btn-sm btn-success" aria-label="Agregar nuevo rubro">
          <Plus size={14} />
        </button>
      </form>
    </div>
  )
}
