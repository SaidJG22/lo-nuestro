// Datos ficticios para el modo demostración (`npm run demo`), pensados para capturas.
// Todo es inventado: clientes, trabajos y montos. Los teléfonos tienen un formato
// inválido a propósito (en Argentina ningún abonado empieza con 0), así ninguno
// puede corresponder a una persona real. Las fechas son relativas a "hoy" para
// que el panel siempre muestre actividad reciente.

const LASER = 'Corte / Grabado Láser'
const REMERAS = 'Estampado / Remeras'
const IMPRESION_3D = 'Impresión 3D'
const CARPINTERIA = 'Carpintería'

const TIPOS_TRABAJO = [LASER, IMPRESION_3D, CARPINTERIA, REMERAS]
const CATEGORIAS = ['Maderas', 'Acrílicos', 'Filamento 3D', 'Pinturas y Lijas', 'Textiles', 'Otros']

const EMPRESA = 'Empresa / Local'
const PARTICULAR = 'Consumidor Final'

const CLIENTES = [
  ['Cervecería Lúpulo Sur', '11 0412-3367', EMPRESA],
  ['Estudio Andes Arquitectura', '11 0533-9120', EMPRESA],
  ['Café de la Esquina', '11 0277-4581', EMPRESA],
  ['Club Atlético Barrio Norte', '11 0619-2245', EMPRESA],
  ['Escuela N.º 12', '', EMPRESA],
  ['Vivero Las Hortensias', '11 0348-7702', EMPRESA],
  ['Lucía Fernández', '11 0154-8831', PARTICULAR],
  ['Martín Gómez', '11 0298-1406', PARTICULAR],
  ['Sofía Ramírez', '11 0731-5590', PARTICULAR],
  ['Julián Paredes', '', PARTICULAR],
  ['Valentina Ríos', '11 0866-0473', PARTICULAR],
  ['Tomás Herrera', '11 0925-3318', PARTICULAR]
]

// [título, tipo, rango de precio, rango de margen, clientes habituales]
const CATALOGO = [
  [
    'Llaveros grabados x50',
    LASER,
    [48000, 58000],
    [0.45, 0.55],
    ['Cervecería Lúpulo Sur', 'Club Atlético Barrio Norte']
  ],
  [
    'Cartel MDF con logo',
    LASER,
    [38000, 85000],
    [0.4, 0.55],
    ['Café de la Esquina', 'Vivero Las Hortensias', 'Cervecería Lúpulo Sur']
  ],
  [
    'Tablas de picar grabadas x4',
    LASER,
    [26000, 34000],
    [0.45, 0.55],
    ['Valentina Ríos', 'Lucía Fernández', 'Martín Gómez']
  ],
  [
    'Señalética en acrílico',
    LASER,
    [70000, 120000],
    [0.38, 0.5],
    ['Estudio Andes Arquitectura', 'Café de la Esquina']
  ],
  [
    'Souvenirs casamiento x100',
    LASER,
    [95000, 140000],
    [0.4, 0.5],
    ['Sofía Ramírez', 'Julián Paredes']
  ],
  ['Caja de té grabada', LASER, [18000, 24000], [0.45, 0.55], ['Lucía Fernández', 'Tomás Herrera']],
  ['Remeras egresados x30', REMERAS, [290000, 360000], [0.3, 0.4], ['Escuela N.º 12']],
  [
    'Buzos con logo x20',
    REMERAS,
    [280000, 340000],
    [0.3, 0.38],
    ['Club Atlético Barrio Norte', 'Cervecería Lúpulo Sur']
  ],
  [
    'Bolsas de lienzo x50',
    REMERAS,
    [110000, 140000],
    [0.35, 0.45],
    ['Vivero Las Hortensias', 'Café de la Esquina']
  ],
  [
    'Remera personalizada',
    REMERAS,
    [16000, 22000],
    [0.4, 0.5],
    ['Tomás Herrera', 'Julián Paredes', 'Valentina Ríos']
  ],
  [
    'Maceta geométrica',
    IMPRESION_3D,
    [12000, 18000],
    [0.5, 0.6],
    ['Sofía Ramírez', 'Vivero Las Hortensias']
  ],
  [
    'Lámpara litofanía',
    IMPRESION_3D,
    [32000, 42000],
    [0.5, 0.6],
    ['Tomás Herrera', 'Lucía Fernández']
  ],
  [
    'Figura personalizada',
    IMPRESION_3D,
    [25000, 40000],
    [0.5, 0.6],
    ['Julián Paredes', 'Martín Gómez']
  ],
  [
    'Soportes para celular x10',
    IMPRESION_3D,
    [28000, 36000],
    [0.5, 0.6],
    ['Cervecería Lúpulo Sur', 'Estudio Andes Arquitectura']
  ],
  [
    'Estante flotante',
    CARPINTERIA,
    [48000, 65000],
    [0.35, 0.45],
    ['Martín Gómez', 'Valentina Ríos']
  ],
  [
    'Mesa ratona de pino',
    CARPINTERIA,
    [180000, 240000],
    [0.35, 0.42],
    ['Valentina Ríos', 'Estudio Andes Arquitectura']
  ],
  [
    'Organizador de escritorio',
    CARPINTERIA,
    [30000, 42000],
    [0.4, 0.5],
    ['Estudio Andes Arquitectura', 'Lucía Fernández']
  ]
]

// Últimos 14 días, armados a mano para que el tablero de Clientes muestre
// todos los estados: [días atrás, título, cliente, estado, seña (fracción), entrega en días]
const RECIENTES = [
  [13, 'Cartel MDF con logo', 'Café de la Esquina', 'Terminado', 1],
  [12, 'Maceta geométrica', 'Sofía Ramírez', 'Terminado', 1],
  [11, 'Bolsas de lienzo x50', 'Vivero Las Hortensias', 'Terminado', 1],
  [10, 'Lámpara litofanía', 'Tomás Herrera', 'Terminado', 0.5],
  [9, 'Señalética en acrílico', 'Estudio Andes Arquitectura', 'A Arreglar', 0.5, 3],
  [8, 'Tablas de picar grabadas x4', 'Valentina Ríos', 'Terminado', 1],
  [7, 'Remeras egresados x30', 'Escuela N.º 12', 'A Hacer', 0.5, -1],
  [6, 'Estante flotante', 'Martín Gómez', 'A Hacer', 0.5, 1],
  [5, 'Figura personalizada', 'Julián Paredes', 'A Arreglar', 0, 4],
  [4, 'Buzos con logo x20', 'Club Atlético Barrio Norte', 'A Hacer', 0.4, 9],
  [3, 'Caja de té grabada', 'Lucía Fernández', 'Terminado', 1],
  [2, 'Souvenirs casamiento x100', 'Sofía Ramírez', 'A Hacer', 0.5, 12],
  [1, 'Soportes para celular x10', 'Cervecería Lúpulo Sur', 'Terminado', 1],
  [1, 'Mesa ratona de pino', 'Valentina Ríos', 'A Hacer', 0.5, 15],
  [0, 'Llaveros grabados x50', 'Cervecería Lúpulo Sur', 'A Hacer', 0.5, 6],
  [0, 'Remera personalizada', 'Tomás Herrera', 'Terminado', 1]
]

// [nombre, categoría, stock, stock mínimo, costo unitario]
const INVENTARIO = [
  ['MDF 3 mm (plancha 60×40)', 'Maderas', 34, 15, 4200],
  ['MDF 5,5 mm (plancha 60×40)', 'Maderas', 12, 10, 6100],
  ['Pino cepillado 1×6"', 'Maderas', 6, 8, 9800],
  ['Acrílico cristal 3 mm', 'Acrílicos', 9, 6, 14500],
  ['Acrílico negro 2 mm', 'Acrílicos', 3, 5, 12800],
  ['Acrílico espejado dorado', 'Acrílicos', 4, 3, 19900],
  ['PLA blanco 1 kg', 'Filamento 3D', 7, 3, 17500],
  ['PLA negro 1 kg', 'Filamento 3D', 5, 3, 17500],
  ['PETG transparente 1 kg', 'Filamento 3D', 1, 2, 21000],
  ['Barniz al agua 1 L', 'Pinturas y Lijas', 4, 2, 11200],
  ['Lija al agua grano 220', 'Pinturas y Lijas', 40, 20, 650],
  ['Remera algodón blanca', 'Textiles', 62, 30, 5200],
  ['Buzo frisa negro', 'Textiles', 18, 10, 14800],
  ['Bolsa de lienzo 35×40', 'Textiles', 75, 40, 1900],
  ['Argollas para llavero x100', 'Otros', 6, 2, 3900]
]

// Movimientos de stock, del más nuevo al más viejo: [días atrás, material, cantidad, motivo]
const MOVIMIENTOS = [
  [0, 'MDF 3 mm (plancha 60×40)', -2, 'Cotización: Llaveros grabados x50'],
  [0, 'Argollas para llavero x100', -1, 'Cotización: Llaveros grabados x50'],
  [0, 'Remera algodón blanca', -1, 'Cotización: Remera personalizada'],
  [1, 'Pino cepillado 1×6"', -3, 'Cotización: Mesa ratona de pino'],
  [1, 'PLA negro 1 kg', -1, 'Cotización: Soportes para celular x10'],
  [2, 'Acrílico espejado dorado', -1, 'Cotización: Souvenirs casamiento x100'],
  [2, 'MDF 3 mm (plancha 60×40)', 20, 'Compra a proveedor'],
  [3, 'MDF 3 mm (plancha 60×40)', -1, 'Cotización: Caja de té grabada'],
  [4, 'Buzo frisa negro', -20, 'Cotización: Buzos con logo x20'],
  [4, 'Buzo frisa negro', 30, 'Compra a proveedor'],
  [5, 'PETG transparente 1 kg', -1, 'Cotización: Figura personalizada'],
  [6, 'Pino cepillado 1×6"', -2, 'Cotización: Estante flotante'],
  [7, 'Remera algodón blanca', -30, 'Cotización: Remeras egresados x30'],
  [9, 'Acrílico cristal 3 mm', -2, 'Cotización: Señalética en acrílico'],
  [10, 'Barniz al agua 1 L', -1, 'Ajuste manual'],
  [11, 'Bolsa de lienzo 35×40', -50, 'Cotización: Bolsas de lienzo x50'],
  [11, 'Bolsa de lienzo 35×40', 100, 'Compra a proveedor']
]

const DIAS_DE_HISTORIA = 365

// Pseudoaleatorio con semilla fija: los mismos datos (y capturas) en cada arranque.
function crearAleatorio(semilla) {
  let a = semilla
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function crearDatosDemo(hoy = new Date(), semilla = 1748) {
  const azar = crearAleatorio(semilla)
  const entre = ([min, max]) => min + (max - min) * azar()
  const elegir = (lista) => lista[Math.floor(azar() * lista.length)]
  // Los pedidos grandes (remeras de egresados, mesas) son menos frecuentes
  const pesoDe = ([, , [, precioMaximo]]) => (precioMaximo > 150000 ? 0.3 : 1)
  const pesoTotal = CATALOGO.reduce((acc, item) => acc + pesoDe(item), 0)
  const elegirDelCatalogo = () => {
    let resto = azar() * pesoTotal
    return CATALOGO.find((item) => (resto -= pesoDe(item)) <= 0) ?? CATALOGO[0]
  }
  const redondear = (monto, paso = 500) => Math.round(monto / paso) * paso

  const fechaHace = (dias, hora, minuto) =>
    new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - dias, hora, minuto)
  const diaLocal = (fecha) =>
    `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`

  // Arma una venta con precio y margen dentro del rango del catálogo.
  // `escala` simula el crecimiento del taller: los trabajos de hace meses valían menos.
  const crearVenta = (dias, titulo, cliente, estado, fraccionSena, diasEntrega, escala = 1) => {
    const [, tipo, rangoPrecio, rangoMargen] = CATALOGO.find(([t]) => t === titulo)
    const totalCobrado = redondear(entre(rangoPrecio) * escala)
    const costo = redondear(totalCobrado * (1 - entre(rangoMargen)))
    const fecha = fechaHace(dias, 9 + Math.floor(azar() * 9), Math.floor(azar() * 60))
    return {
      fecha: fecha.toISOString(),
      titulo,
      cliente,
      tipo,
      estado,
      costo,
      ganancia: totalCobrado - costo,
      totalCobrado,
      sena: redondear(totalCobrado * fraccionSena),
      ...(diasEntrega !== undefined && { fechaEntrega: diaLocal(fechaHace(-diasEntrega, 12, 0)) })
    }
  }

  // Historial: cada vez más trabajos (y mejor pagos) a medida que se acerca a hoy.
  const historial = []
  for (let dias = DIAS_DE_HISTORIA; dias >= 15; dias--) {
    const avance = 1 - dias / DIAS_DE_HISTORIA
    if (azar() > 0.06 + 0.26 * avance) continue
    const [titulo, , , , habituales] = elegirDelCatalogo()
    // Un par de trabajos viejos quedaron con saldo pendiente
    const fraccionSena = azar() < 0.04 ? 0.5 : 1
    historial.push(
      crearVenta(
        dias,
        titulo,
        elegir(habituales),
        'Terminado',
        fraccionSena,
        undefined,
        0.78 + 0.22 * avance
      )
    )
  }

  const recientes = RECIENTES.map(([dias, titulo, cliente, estado, sena, entrega]) =>
    crearVenta(dias, titulo, cliente, estado, sena, entrega)
  )

  const ventas = [...historial, ...recientes]
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .map((venta, i) => ({ id: 1000 + i, ...venta }))

  const clientes = CLIENTES.map(([nombre, telefono, tipo], i) => ({
    id: i + 1,
    nombre,
    telefono,
    tipo
  }))

  const inventario = INVENTARIO.map(([nombre, categoria, stock, stockMinimo, costo], i) => ({
    id: 101 + i,
    nombre,
    categoria,
    stock,
    stockMinimo,
    costo
  }))

  // Del más nuevo al más viejo: el stock resultante de cada movimiento es el
  // stock "actual" en ese momento, y antes de él había `stock - cantidad`.
  const stockAlMomento = new Map(inventario.map((m) => [m.nombre, m.stock]))
  const movimientosStock = MOVIMIENTOS.map(([dias, nombre, cantidad, motivo], i) => {
    const material = inventario.find((m) => m.nombre === nombre)
    const stockResultante = stockAlMomento.get(nombre)
    stockAlMomento.set(nombre, stockResultante - cantidad)
    return {
      id: `demo-movimiento-${i}`,
      fecha: fechaHace(dias, 18 - (i % 8), 30).toISOString(),
      materialId: material.id,
      material: nombre,
      cantidad,
      motivo,
      stockResultante
    }
  })

  return {
    ventas,
    clientes,
    inventario,
    tiposTrabajo: TIPOS_TRABAJO,
    categoriasInventario: CATEGORIAS,
    movimientosStock
  }
}
