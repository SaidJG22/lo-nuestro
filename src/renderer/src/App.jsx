import { useEffect, useState } from 'react'
import { LayoutDashboard, Calculator, Package, Users, Sun, Moon, Search } from 'lucide-react'
import './styles/TemaGlobal.css'
import logo from './assets/logo-ln.png'
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
          <img className="sidebar-logo-img" src={logo} alt="" />
          <span className="sidebar-logo-nombre">Lo Nuestro</span>
          <span className="divisor-estrella" aria-hidden="true" />
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
        <div className="sidebar-footer">
          <button className="nav-boton" onClick={() => setBuscadorAbierto(true)}>
            <Search size={20} />
            <span className="label">Buscar</span>
            <kbd className="nav-atajo">Ctrl K</kbd>
          </button>
          <button className="nav-boton" onClick={toggleTema}>
            {tema === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span className="label">{tema === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>
        </div>
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
