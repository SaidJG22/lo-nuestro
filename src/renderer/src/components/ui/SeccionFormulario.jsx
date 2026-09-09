import './SeccionFormulario.css'

export default function SeccionFormulario({ icon: Icon, title, children }) {
  return (
    <div className="seccion-formulario">
      <div className="seccion-formulario-header">
        {Icon && <Icon size={16} />}
        <span>{title}</span>
      </div>
      <div className="seccion-formulario-body">{children}</div>
    </div>
  )
}
