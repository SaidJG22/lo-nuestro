import { useEffect, useRef, useState } from 'react'

const prefiereMenosMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Anima un número desde su valor anterior hasta `valor` (ease-out).
// Con "reducir movimiento" activado devuelve el valor final directamente.
export function useContador(valor, duracion = 900) {
  const [mostrado, setMostrado] = useState(0)
  const actualRef = useRef(0)
  const sinMovimiento = prefiereMenosMovimiento()

  useEffect(() => {
    if (sinMovimiento) return
    const desde = actualRef.current
    const inicio = performance.now()
    let frame

    const paso = (ahora) => {
      const progreso = Math.min(1, (ahora - inicio) / duracion)
      const suavizado = 1 - Math.pow(1 - progreso, 3)
      const actual = desde + (valor - desde) * suavizado
      actualRef.current = actual
      setMostrado(actual)
      if (progreso < 1) frame = requestAnimationFrame(paso)
    }

    frame = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(frame)
  }, [valor, duracion, sinMovimiento])

  return sinMovimiento ? valor : mostrado
}
