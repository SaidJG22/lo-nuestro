import { useState } from 'react'
import { Zap, LayoutDashboard, Calculator, Package, Users } from 'lucide-react'
import './styles/TemaGlobal.css'
import Calculadora from './components/Calculadora'
import Dashboard from './components/Dashboard'
import Inventario from './components/Inventario'
import Clientes from './components/Clientes'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Ganancias', icon: LayoutDashboard },
  { id: 'calculadora', label: 'Cotizador', icon: Calculator },
  { id: 'inventario', label: 'Stock', icon: Package },
  { id: 'clientes', label: 'Clientes', icon: Users }
]

function App() {
  const [pantallaActiva, setPantallaActiva] = useState('dashboard')

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-logo">
          <Zap size={22} />
          <span>Lo Nuestro</span>
        </div>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-boton ${pantallaActiva === id ? 'activo' : ''}`}
            onClick={() => setPantallaActiva(id)}
          >
            <Icon size={20} />
            <span className="label">{label}</span>
          </button>
        ))}
      </nav>

      <main className="main-content">
        {pantallaActiva === 'dashboard' && <Dashboard />}
        {pantallaActiva === 'calculadora' && (
          <div className="fade-in" style={{ height: '100%' }}>
            <Calculadora />
          </div>
        )}
        {pantallaActiva === 'inventario' && <Inventario />}
        {pantallaActiva === 'clientes' && <Clientes />}
      </main>
    </div>
  )
}

export default App
