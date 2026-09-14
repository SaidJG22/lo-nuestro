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

  const handleAgregarTipo = () => {
    if (nuevoTipoInput.trim() !== '') {
      agregarTipoTrabajo(nuevoTipoInput)
      setTipoActual(nuevoTipoInput)
      setNuevoTipoInput('')
    }
  }

  const handleKeyDownNuevoTipo = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAgregarTipo()
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
      <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control form-control-sm input-dark"
          placeholder={placeholder}
          value={nuevoTipoInput}
          onChange={(e) => setNuevoTipoInput(e.target.value)}
          onKeyDown={handleKeyDownNuevoTipo}
        />
        <button
          type="button"
          className="btn btn-sm btn-success"
          aria-label="Agregar nuevo rubro"
          onClick={handleAgregarTipo}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}
