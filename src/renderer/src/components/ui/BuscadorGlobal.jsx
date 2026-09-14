import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, User, Package, Briefcase } from 'lucide-react'
import { useStore } from '../../store/useStore'
import './BuscadorGlobal.css'

const LIMITE_POR_GRUPO = 5

export default function BuscadorGlobal({ abierto, onCerrar, onNavegar }) {
  const { clientes, inventario, ventas } = useStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  const cerrar = () => {
    setQuery('')
    onCerrar()
  }

  useEffect(() => {
    if (!abierto) return undefined
    inputRef.current?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') cerrar()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto])

  const grupos = useMemo(() => {
    const termino = query.trim().toLowerCase()
    if (!termino) return []

    const resultadosClientes = clientes
      .filter((c) => c.nombre.toLowerCase().includes(termino))
      .slice(0, LIMITE_POR_GRUPO)
    const resultadosMateriales = inventario
      .filter((m) => m.nombre.toLowerCase().includes(termino))
      .slice(0, LIMITE_POR_GRUPO)
    const resultadosTrabajos = ventas
      .filter((v) => v.titulo?.toLowerCase().includes(termino))
      .slice(0, LIMITE_POR_GRUPO)

    return [
      {
        id: 'clientes',
        label: 'Clientes',
        icon: User,
        pantalla: 'clientes',
        items: resultadosClientes.map((c) => ({ id: c.id, texto: c.nombre }))
      },
      {
        id: 'materiales',
        label: 'Materiales',
        icon: Package,
        pantalla: 'inventario',
        items: resultadosMateriales.map((m) => ({
          id: m.id,
          texto: `${m.nombre} (${m.categoria})`
        }))
      },
      {
        id: 'trabajos',
        label: 'Trabajos',
        icon: Briefcase,
        pantalla: 'clientes',
        items: resultadosTrabajos.map((v) => ({ id: v.id, texto: `${v.titulo} - ${v.cliente}` }))
      }
    ].filter((grupo) => grupo.items.length > 0)
  }, [query, clientes, inventario, ventas])

  if (!abierto) return null

  const handleSeleccionar = (pantalla) => {
    onNavegar(pantalla)
    cerrar()
  }

  return (
    <div className="buscador-global-overlay" onMouseDown={cerrar}>
      <div
        className="buscador-global-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Buscador global"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="buscador-global-input">
          <Search size={18} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar clientes, materiales o trabajos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd>Esc</kbd>
        </div>

        {query.trim() !== '' && grupos.length === 0 && (
          <p className="buscador-global-vacio">Sin resultados para &quot;{query}&quot;.</p>
        )}

        {grupos.map((grupo) => {
          const Icon = grupo.icon
          return (
            <div key={grupo.id} className="buscador-global-grupo">
              <h5 className="buscador-global-grupo-titulo">
                <Icon size={14} /> {grupo.label}
              </h5>
              {grupo.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="buscador-global-item"
                  onClick={() => handleSeleccionar(grupo.pantalla)}
                >
                  {item.texto}
                </button>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
