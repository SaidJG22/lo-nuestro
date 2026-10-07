import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_MOVIMIENTOS = 200

const registrarMovimiento = (movimientos, material, cantidad, motivo, stockResultante) =>
  [
    {
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      materialId: material.id,
      material: material.nombre,
      cantidad,
      motivo,
      stockResultante
    },
    ...(movimientos ?? [])
  ].slice(0, MAX_MOVIMIENTOS)

export const useStore = create(
  persist(
    (set) => ({
      // Tablas base
      ventas: [],
      inventario: [
        { id: 1, nombre: 'MDF 3mm', categoria: 'Maderas', stock: 5, stockMinimo: 10, costo: 5000 },
        {
          id: 2,
          nombre: 'Acrílico 2mm',
          categoria: 'Acrílicos',
          stock: 15,
          stockMinimo: 5,
          costo: 12000
        }
      ],
      clientes: [],
      tiposTrabajo: ['Corte / Grabado Láser', 'Impresión 3D', 'Carpintería', 'Estampado / Remeras'],
      categoriasInventario: [
        'Maderas',
        'Acrílicos',
        'Filamento 3D',
        'Pinturas y Lijas',
        'Textiles',
        'Otros'
      ],
      movimientosStock: [],
      tema: 'light',

      // Tema claro/oscuro
      toggleTema: () => set((state) => ({ tema: state.tema === 'dark' ? 'light' : 'dark' })),

      // NUEVO: Resetear gráficos y ventas
      resetearVentas: () => set({ ventas: [] }),

      // Backup: reemplaza todos los datos por los de un archivo importado
      restaurarBackup: (datos) =>
        set((state) => ({
          ventas: datos.ventas ?? state.ventas,
          inventario: datos.inventario ?? state.inventario,
          clientes: datos.clientes ?? state.clientes,
          tiposTrabajo: datos.tiposTrabajo ?? state.tiposTrabajo,
          categoriasInventario: datos.categoriasInventario ?? state.categoriasInventario,
          movimientosStock: datos.movimientosStock ?? state.movimientosStock
        })),

      // Tipos de Trabajo
      agregarTipoTrabajo: (nuevoTipo) =>
        set((state) => {
          if (state.tiposTrabajo.includes(nuevoTipo)) return state
          return { tiposTrabajo: [...state.tiposTrabajo, nuevoTipo] }
        }),
      eliminarTipoTrabajo: (tipo) =>
        set((state) => ({
          tiposTrabajo: state.tiposTrabajo.filter((t) => t !== tipo)
        })),

      // Ventas (Mejorado: Autoguarda el cliente si no existe)
      agregarVenta: (nuevaVenta) =>
        set((state) => {
          const clienteExiste = state.clientes.some(
            (c) => c.nombre.toLowerCase() === nuevaVenta.cliente.toLowerCase()
          )
          let nuevosClientes = state.clientes

          if (!clienteExiste && nuevaVenta.cliente.trim() !== '') {
            nuevosClientes = [
              ...state.clientes,
              { id: Date.now(), nombre: nuevaVenta.cliente, telefono: '', tipo: 'Consumidor Final' }
            ]
          }

          return {
            ventas: [
              ...state.ventas,
              { id: Date.now(), fecha: new Date().toISOString(), ...nuevaVenta }
            ],
            clientes: nuevosClientes
          }
        }),

      // NUEVO: Cambiar de "A Hacer" a "Terminado"
      actualizarEstadoVenta: (idVenta, nuevoEstado) =>
        set((state) => ({
          ventas: state.ventas.map((v) => (v.id === idVenta ? { ...v, estado: nuevoEstado } : v))
        })),
      eliminarVenta: (idVenta) =>
        set((state) => ({
          ventas: state.ventas.filter((v) => v.id !== idVenta)
        })),
      eliminarVentas: (ids) =>
        set((state) => {
          const aBorrar = new Set(ids)
          return { ventas: state.ventas.filter((v) => !aBorrar.has(v.id)) }
        }),
      actualizarVenta: (idVenta, cambios) =>
        set((state) => ({
          ventas: state.ventas.map((v) => (v.id === idVenta ? { ...v, ...cambios } : v))
        })),

      // Inventario
      agregarMaterial: (nuevoMaterial) =>
        set((state) => {
          const material = { id: Date.now(), ...nuevoMaterial }
          return {
            inventario: [...state.inventario, material],
            movimientosStock: registrarMovimiento(
              state.movimientosStock,
              material,
              material.stock,
              'Alta de material',
              material.stock
            )
          }
        }),
      actualizarStock: (id, cantidad, motivo = 'Ajuste manual') =>
        set((state) => {
          const item = state.inventario.find((m) => m.id === id)
          if (!item) return state
          const stockResultante = item.stock + cantidad
          return {
            inventario: state.inventario.map((m) =>
              m.id === id ? { ...m, stock: stockResultante } : m
            ),
            movimientosStock: registrarMovimiento(
              state.movimientosStock,
              item,
              cantidad,
              motivo,
              stockResultante
            )
          }
        }),
      eliminarMovimiento: (id) =>
        set((state) => ({
          movimientosStock: state.movimientosStock.filter((m) => m.id !== id)
        })),
      limpiarMovimientos: () => set({ movimientosStock: [] }),
      eliminarMaterial: (id) =>
        set((state) => ({
          inventario: state.inventario.filter((item) => item.id !== id)
        })),
      restaurarMaterial: (item, indice) =>
        set((state) => {
          const nuevo = [...state.inventario]
          nuevo.splice(Math.min(Math.max(indice, 0), nuevo.length), 0, item)
          return { inventario: nuevo }
        }),
      agregarCategoriaInventario: (nuevaCategoria) =>
        set((state) => {
          if (state.categoriasInventario.includes(nuevaCategoria)) return state
          return { categoriasInventario: [...state.categoriasInventario, nuevaCategoria] }
        }),
      eliminarCategoriaInventario: (categoria) =>
        set((state) => ({
          categoriasInventario: state.categoriasInventario.filter((c) => c !== categoria)
        })),

      // Clientes
      agregarCliente: (nuevoCliente) =>
        set((state) => ({
          clientes: [...state.clientes, { id: Date.now(), ...nuevoCliente }]
        })),
      eliminarCliente: (id) =>
        set((state) => ({
          clientes: state.clientes.filter((cliente) => cliente.id !== id)
        }))
    }),
    {
      name: 'lo-nuestro-db',
      version: 1,
      // v1: estrena el tema claro "kraft" como predeterminado (una sola vez)
      migrate: (persistido, version) => {
        if (version < 1) return { ...persistido, tema: 'light' }
        return persistido
      }
    }
  )
)
