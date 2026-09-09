import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

      // NUEVO: Resetear gráficos y ventas
      resetearVentas: () => set({ ventas: [] }),

      // Backup: reemplaza todos los datos por los de un archivo importado
      restaurarBackup: (datos) =>
        set((state) => ({
          ventas: datos.ventas ?? state.ventas,
          inventario: datos.inventario ?? state.inventario,
          clientes: datos.clientes ?? state.clientes,
          tiposTrabajo: datos.tiposTrabajo ?? state.tiposTrabajo,
          categoriasInventario: datos.categoriasInventario ?? state.categoriasInventario
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
      actualizarVenta: (idVenta, cambios) =>
        set((state) => ({
          ventas: state.ventas.map((v) => (v.id === idVenta ? { ...v, ...cambios } : v))
        })),

      // Inventario
      agregarMaterial: (nuevoMaterial) =>
        set((state) => ({
          inventario: [...state.inventario, { id: Date.now(), ...nuevoMaterial }]
        })),
      actualizarStock: (id, cantidad) =>
        set((state) => ({
          inventario: state.inventario.map((item) =>
            item.id === id ? { ...item, stock: item.stock + cantidad } : item
          )
        })),
      eliminarMaterial: (id) =>
        set((state) => ({
          inventario: state.inventario.filter((item) => item.id !== id)
        })),
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
      name: 'lo-nuestro-db'
    }
  )
)
