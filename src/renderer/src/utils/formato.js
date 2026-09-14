export function formatearPesos(monto) {
  return `$${Math.round(monto || 0).toLocaleString('es-AR')}`
}
