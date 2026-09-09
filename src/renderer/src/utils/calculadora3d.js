/**
 * Calcula los costos detallados y el precio final de una pieza 3D.
 * @param {Object} params - Objeto con todas las variables de entrada.
 * @returns {Object} Desglose completo de costos y precio final.
 */
export const calcularCostos3D = (params) => {
  const {
    // Material
    precioRollo,
    pesoTotalRolloGramos,
    gramosConsumidos,
    // Máquina
    costoOperativoHoraMaquina, // Incluye desgaste (nozzle, pantalla) + electricidad
    tiempoImpresionHoras, // Tiempo directo en horas (o conversión desde minutos)
    // Mano de Obra
    precioHoraTrabajo,
    tiempoPreparacionHoras, // Tiempo en el Slicer
    tiempoPostProcesadoHoras, // Quitar soportes, lijar, etc.
    // Márgenes e Indirectos
    porcentajeFallo, // Ej: 10 para 10%
    costoEmpaque,
    gastosFijos, // Puede ser un monto fijo o porcentaje
    margenGanancia // Ej: 2 para 100%, 3 para 200%
  } = params

  // 1. Costo de material (Filamento o Resina)
  // Fórmula: (Precio del rollo / Peso total) * Gramos consumidos
  const costoMaterial =
    pesoTotalRolloGramos > 0 ? (precioRollo / pesoTotalRolloGramos) * gramosConsumidos : 0

  // 2. Costo de máquina
  // Conversión de unidades: Si el usuario ingresa minutos, se divide entre 60 para pasar a horas.
  // Fórmula: Costo operativo por hora * Tiempo de impresión
  const costoMaquina = costoOperativoHoraMaquina * tiempoImpresionHoras

  // 3. Mano de obra
  // Fórmula: Precio hora de trabajo * (Preparación + Post-procesado)
  const tiempoTotalManoObra = tiempoPreparacionHoras + tiempoPostProcesadoHoras
  const costoManoObra = precioHoraTrabajo * tiempoTotalManoObra

  // 4. Margen de fallo
  // Fórmula: Porcentaje aplicado a la suma del material y la máquina
  const sumaMaterialYMaquina = costoMaterial + costoMaquina
  const costoFallo = sumaMaterialYMaquina * (porcentajeFallo / 100)

  // 5. Costos indirectos
  // Fórmula: Empaque + Gastos fijos
  const costosIndirectos = costoEmpaque + gastosFijos

  // 6. Costo Base
  // Suma de todos los componentes anteriores
  const costoBase = costoMaterial + costoMaquina + costoManoObra + costoFallo + costosIndirectos

  // 7. Precio Final de Venta
  // Fórmula: Costo Base * Margen de ganancia
  const precioFinal = costoBase * margenGanancia

  return {
    costoMaterial,
    costoMaquina,
    costoManoObra,
    costoFallo,
    costosIndirectos,
    costoBase,
    precioFinal
  }
}
