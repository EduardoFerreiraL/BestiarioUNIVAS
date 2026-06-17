import { Link } from 'react-router-dom'
import CreaturePortrait from './CreaturePortrait'

function formatarNivelDesafio(nivelDesafio) {
  if (nivelDesafio === 0.125) return '1/8'
  if (nivelDesafio === 0.25) return '1/4'
  if (nivelDesafio === 0.5) return '1/2'
  return String(nivelDesafio)
}

export default function MonsterCard({ criatura }) {
  return (
    <article className="monster-card">
      <div className="monster-portrait">
        <span className="challenge-badge">
          ND <strong>{formatarNivelDesafio(criatura.nivelDesafio)}</strong>
        </span>
        <CreaturePortrait criatura={criatura} />
      </div>

      <div className="monster-content">
        <h2>{criatura.nome}</h2>
        <strong>
          {criatura.tipo}, {criatura.tamanho}
        </strong> 
        
        <Link 
          to={`/monstro/${criatura.id}`} 
          className="info-button" 
          style={{ textDecoration: 'none', textAlign: 'center', display: 'block', marginTop: '10px', lineHeight: '21px' }}
        >
          Ficha Completa
        </Link>
      </div>
    </article>
  )
}