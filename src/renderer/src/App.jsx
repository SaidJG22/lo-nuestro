import { useEffect, useState } from 'react'
import { Zap, LayoutDashboard, Calculator, Package, Users, Sun, Moon, Search } from 'lucide-react'
import './styles/TemaGlobal.css'
import { useStore } from './store/useStore'
import Calculadora from './components/Calculadora'
import Dashboard from './components/Dashboard'
import Inventario from './components/Inventario'
import Clientes from './components/Clientes'
import BuscadorGlobal from './components/ui/BuscadorGlobal'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Ganancias', icon: LayoutDashboard },
  { id: 'calculadora', label: 'Cotizador', icon: Calculator },
  { id: 'inventario', label: 'Stock', icon: Package },
  { id: 'clientes', label: 'Clientes', icon: Users }
]

function App() {
  const [pantallaActiva, setPantallaActiva] = useState('dashboard')
  const [buscadorAbierto, setBuscadorAbierto] = useState(false)
  const { tema, toggleTema } = useStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema)
  }, [tema])

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setBuscadorAbierto(true)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

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
        <button className="nav-boton" onClick={() => setBuscadorAbierto(true)}>
          <Search size={20} />
          <span className="label">Buscar (Ctrl+K)</span>
        </button>
        <button className="nav-boton" onClick={toggleTema}>
          {tema === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span className="label">{tema === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
        </button>
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

      <BuscadorGlobal
        abierto={buscadorAbierto}
        onCerrar={() => setBuscadorAbierto(false)}
        onNavegar={setPantallaActiva}
      />
    </div>
  )
}

export default App
