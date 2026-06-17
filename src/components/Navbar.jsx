import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="main-nav" aria-label="Navegação principal">
      <Link to="/">Início</Link>
      <Link to="/monstros">Catálogo</Link>
      <Link to="/sobre">Sobre</Link>
    </nav>
  )
}