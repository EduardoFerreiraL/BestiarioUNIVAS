import { Link } from 'react-router-dom'
import Navbar from './Navbar'

export default function Header() {
  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <span className="brand-mark">20</span>
        <span>
          <strong>Bestiário</strong>
          <small>Criaturas de D&amp;D 5e</small>
        </span>
      </Link>
      
      <Navbar />
    </header>
  )
}