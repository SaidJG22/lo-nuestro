import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import {
  PlusCircle,
  AlertTriangle,
  Minus,
  Plus,
  Trash2,
  TreePine,
  Shapes,
  Boxes,
  Palette,
  Shirt,
  Package,
  Search
} from 'lucide-react'
import { useConfirm } from './ui/ConfirmModal'
import SelectorTipoTrabajo from './ui/SelectorTipoTrabajo'
import '../styles/Inventario.css'

const ICONOS_CATEGORIA = {
  Maderas: TreePine,
  Acrílicos: Shapes,
  'Filamento 3D': Boxes,
  'Pinturas y Lijas': Palette,
  Textiles: Shirt
}

export default function Inventario() {
  const {
    inventario,
    agregarMaterial,
    actualizarStock,
    eliminarMaterial,
    categoriasInventario,
    agregarCategoriaInventario,
    eliminarCategoriaInventario
  } = useStore()
  const confirmar = useConfirm()
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState(categoriasInventario[0] || 'Otros')
  const [stock, setStock] = useState('')
  const [stockMinimo, setStockMinimo] = useState('')
  const [costo, setCosto] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const handleAgregar = (e) => {
    e.preventDefault()
    if (!nombre) return
    agregarMaterial({
      nombre,
      categoria,
      stock: Number(stock),
      stockMinimo: Number(stockMinimo),
      costo: Number(costo)
    })
    setNombre('')
    setStock('')
    setStockMinimo('')
    setCosto('')
  }

  const handleEliminar = async (item) => {
    const ok = await confirmar(
      `Se eliminará "${item.nombre}" del inventario de forma permanente.`,
      {
        title: 'Eliminar material',
        danger: true
      }
    )
    if (ok) eliminarMaterial(item.id)
  }

  const inventarioFiltrado = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) return inventario
    return inventario.filter((item) => item.nombre.toLowerCase().includes(termino))
  }, [inventario, busqueda])

  const grupos = useMemo(() => {
    const categoriasConocidas = new Set(categoriasInventario)
    const porCategoria = categoriasInventario.map((cat) => ({
      nombre: cat,
      items: inventarioFiltrado.filter((item) => item.categoria === cat)
    }))
    const sinCategoria = inventarioFiltrado.filter(
      (item) => !categoriasConocidas.has(item.categoria)
    )
    if (sinCategoria.length > 0) porCategoria.push({ nombre: 'Sin Categoría', items: sinCategoria })
    return porCategoria.filter((grupo) => grupo.items.length > 0)
  }, [inventarioFiltrado, categoriasInventario])

  const valorTotalInventario = inventario.reduce((acc, item) => acc + item.stock * item.costo, 0)

  return (
    <div className="inventario-container fade-in">
      <div className="glass-panel">
        <h4
          className="d-flex align-items-center gap-2 mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          <PlusCircle size={20} /> Nuevo Material
        </h4>
        <form onSubmit={handleAgregar} className="inventario-form">
          <div className="campo-inventario">
            <label htmlFor="inv-nombre">Nombre</label>
            <input
              id="inv-nombre"
              type="text"
              className="form-control input-dark"
              placeholder="Ej. MDF 3mm"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <SelectorTipoTrabajo
            tiposTrabajo={categoriasInventario}
            tipoActual={categoria}
            setTipoActual={setCategoria}
            agregarTipoTrabajo={agregarCategoriaInventario}
            eliminarTipoTrabajo={eliminarCategoriaInventario}
            label="Categoría del Material"
            placeholder="Crear nueva categoría..."
          />

          <div className="campo-inventario">
            <label htmlFor="inv-stock">Stock Actual</label>
            <input
              id="inv-stock"
              type="number"
              className="form-control input-dark"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div className="campo-inventario">
            <label htmlFor="inv-stock-min">Alerta Mínima</label>
            <input
              id="inv-stock-min"
              type="number"
              className="form-control input-dark"
              value={stockMinimo}
              onChange={(e) => setStockMinimo(e.target.value)}
            />
          </div>
          <div className="campo-inventario">
            <label htmlFor="inv-costo">Costo ($)</label>
            <input
              id="inv-costo"
              type="number"
              className="form-control input-dark"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
            />
          </div>
          <div className="campo-inventario campo-inventario-submit">
            <button type="submit" className="btn btn-success w-100">
              Agregar
            </button>
          </div>
        </form>
      </div>

      {inventario.length === 0 ? (
        <p className="text-center mt-5" style={{ color: 'var(--color-text-muted)' }}>
          Todavía no cargaste materiales.
        </p>
      ) : (
        <>
          <div className="buscador-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar material..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <p className="inventario-resumen-total">
            Valor total en stock: <strong>${valorTotalInventario.toFixed(2)}</strong>
          </p>

          {grupos.length === 0 && (
            <p className="text-center mt-5" style={{ color: 'var(--color-text-muted)' }}>
              No se encontraron materiales.
            </p>
          )}

          {grupos.map((grupo) => {
            const Icono = ICONOS_CATEGORIA[grupo.nombre] || Package
            const valorCategoria = grupo.items.reduce(
              (acc, item) => acc + item.stock * item.costo,
              0
            )

            return (
              <div key={grupo.nombre} className="categoria-inventario-seccion">
                <div className="categoria-inventario-header">
                  <span className="categoria-inventario-titulo">
                    <Icono size={18} /> {grupo.nombre}
                  </span>
                  <span className="categoria-inventario-meta">
                    {grupo.items.length} material{grupo.items.length === 1 ? '' : 'es'} · $
                    {valorCategoria.toFixed(2)}
                  </span>
                </div>
                <div className="tabla-glass">
                  <table>
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>Costo</th>
                        <th>Stock Actual</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grupo.items.map((item) => (
                        <tr key={item.id}>
                          <td className="fw-bold">{item.nombre}</td>
                          <td className="celda-numero">${item.costo}</td>
                          <td>
                            <span className="me-3 fs-5 celda-numero">{item.stock}</span>
                            {item.stock <= item.stockMinimo && (
                              <span className="alerta-stock">
                                <AlertTriangle size={14} /> Reponer
                              </span>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn-icono btn-icono-danger me-1"
                              aria-label={`Restar stock a ${item.nombre}`}
                              onClick={() => actualizarStock(item.id, -1)}
                            >
                              <Minus size={14} />
                            </button>
                            <button
                              className="btn-icono btn-icono-success me-3"
                              aria-label={`Sumar stock a ${item.nombre}`}
                              onClick={() => actualizarStock(item.id, 1)}
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              className="btn-icono btn-icono-danger-solido"
                              aria-label={`Eliminar ${item.nombre}`}
                              onClick={() => handleEliminar(item)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
