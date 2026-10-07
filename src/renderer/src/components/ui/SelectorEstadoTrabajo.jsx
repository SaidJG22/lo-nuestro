export default function SelectorEstadoTrabajo({ value, onChange }) {
  return (
    <select
      className="form-select w-auto input-dark border-warning"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="A Hacer">⏳ A Hacer</option>
      <option value="A Arreglar">🛠️ A Arreglar</option>
      <option value="Terminado">✅ Terminado</option>
    </select>
  )
}
