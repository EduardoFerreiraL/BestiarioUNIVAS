import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div style={{ textTransform: 'none', textAlign: 'center', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '5rem', color: 'var(--gold)', margin: '0' }}>404</h1>
      <h2 style={{ fontSize: '1.8rem', color: 'var(--gold-light)', marginBottom: '20px' }}>
        Portal para o Limbo Ativado!
      </h2>
      <p style={{ color: '#e60909ff', maxWidth: '500px', margin: '0 auto 30px auto', lineHeight: '1.6' }}>
        Falha crítica playboy, rolou um nat 1 em Investigação. A página ou caminho que você está procurando se perdeu nos Planos Exteriores ou foi devorada por um Devorador de Mentes.
      </p>
      
      <Link to="/monstros" className="info-button" style={{ textDecoration: 'none', display: 'inline-block' }}>
        Voltar para a Segurança do Catálogo
      </Link>
    </div>
  )
}