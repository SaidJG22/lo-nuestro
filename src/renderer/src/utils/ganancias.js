// Helpers para agrupar el historial de ventas por día y por mes.
// Las claves usan componentes de fecha LOCALES (no UTC) para que un trabajo
// guardado a la noche no "salte" al día siguiente por el corrimiento de zona horaria.

function claveDia(fechaISO) {
  const d = new Date(fechaISO)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function claveMes(fechaISO) {
  const d = new Date(fechaISO)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function agrupar(ventas, obtenerClave, obtenerLabel) {
  const grupos = new Map()

  for (const venta of ventas) {
    const clave = obtenerClave(venta.fecha)
    if (!grupos.has(clave)) {
      grupos.set(clave, {
        clave,
        label: obtenerLabel(venta.fecha),
        ganancia: 0,
        costo: 0,
        cantidad: 0
      })
    }
    const grupo = grupos.get(clave)
    grupo.ganancia += venta.ganancia
    grupo.costo += venta.costo
    grupo.cantidad += 1
  }

  return Array.from(grupos.values()).sort((a, b) => a.clave.localeCompare(b.clave))
}

export function agruparGananciasPorDia(ventas) {
  return agrupar(ventas, claveDia, (fechaISO) =>
    new Date(fechaISO).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  )
}

export function agruparGananciasPorMes(ventas) {
  return agrupar(ventas, claveMes, (fechaISO) =>
    capitalizar(new Date(fechaISO).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }))
  )
}

export function agruparGananciasPorTipo(ventas) {
  const grupos = new Map()

  for (const venta of ventas) {
    const clave = venta.tipo || 'Sin Tipo'
    if (!grupos.has(clave)) {
      grupos.set(clave, { tipo: clave, ganancia: 0, costo: 0, cantidad: 0 })
    }
    const grupo = grupos.get(clave)
    grupo.ganancia += venta.ganancia
    grupo.costo += venta.costo
    grupo.cantidad += 1
  }

  return Array.from(grupos.values()).sort((a, b) => b.ganancia - a.ganancia)
}

export function gananciaDeHoy(ventas) {
  const hoy = claveDia(new Date().toISOString())
  return ventas.filter((v) => claveDia(v.fecha) === hoy).reduce((acc, v) => acc + v.ganancia, 0)
}

export function gananciaDelMes(ventas) {
  const mesActual = claveMes(new Date().toISOString())
  return ventas
    .filter((v) => claveMes(v.fecha) === mesActual)
    .reduce((acc, v) => acc + v.ganancia, 0)
}

export function etiquetaHoy() {
  return new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function etiquetaMesActual() {
  return capitalizar(new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }))
}
