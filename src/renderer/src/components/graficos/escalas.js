// Marcas "redondas" para un eje (0 · 10 k · 20 k…): paso de 1, 2, 2,5 o 5 × 10ⁿ.
export function marcasRedondas(maximo, cantidad = 4) {
  if (!(maximo > 0)) return [0]
  const crudo = maximo / cantidad
  const potencia = 10 ** Math.floor(Math.log10(crudo))
  const paso = [1, 2, 2.5, 5, 10].map((m) => m * potencia).find((p) => p >= crudo)
  return Array.from({ length: Math.ceil(maximo / paso) + 1 }, (_, i) => i * paso)
}
