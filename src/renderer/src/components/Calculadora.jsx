import { useState } from 'react'
import { useStore } from '../store/useStore'
import Calculadora3D from './Calculadoras/Calculadora3D'
import CalculadoraLaser from './Calculadoras/CalculadoraLaser'
import CalculadoraGeneral from './Calculadoras/CalculadoraGeneral'

export default function Calculadora() {
  const { tiposTrabajo } = useStore()
  const [tipoTrabajoActual, setTipoTrabajoActual] = useState(
    tiposTrabajo[0] || 'Corte / Grabado Láser'
  )

  const es3D = tipoTrabajoActual.toLowerCase().includes('3d')
  const esLaser =
    tipoTrabajoActual.toLowerCase().includes('laser') ||
    tipoTrabajoActual.toLowerCase().includes('láser')

  return (
    <div style={{ height: '100%' }}>
      {es3D ? (
        <Calculadora3D tipoActual={tipoTrabajoActual} setTipoActual={setTipoTrabajoActual} />
      ) : esLaser ? (
        <CalculadoraLaser tipoActual={tipoTrabajoActual} setTipoActual={setTipoTrabajoActual} />
      ) : (
        <CalculadoraGeneral tipoActual={tipoTrabajoActual} setTipoActual={setTipoTrabajoActual} />
      )}
    </div>
  )
}
