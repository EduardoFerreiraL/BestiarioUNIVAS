import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <section className="app-about" style={{ maxWidth: '700px', width: '100%', margin: '40px auto 0' }} aria-labelledby="home-titulo">
      <div className="app-about__card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Usando a nova classe de título escuro */}
        <h2 id="home-titulo" className="page-title" style={{ textAlign: 'center' }}>
          Bem-vindo ao seu Bestiário
        </h2>
        
        {/* Usando a nova classe de texto escuro */}
        <p className="page-text" style={{ textAlign: 'center' }}>
          Explore o nosso catálogo completo de Monstros presentes no famoso universo de Dungeons &amp; Dragons 5e. 
          Utilize a nossa busca inteligente por nome, configure os filtros por nível de desafio (ND), tipos ou 
          tamanhos e clique nos cards para revelar fichas detalhadas vindas direto do grimório oficial.
        </p>

        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <Link to="/monstros" className="clear-button" style={{ textDecoration: 'none', display: 'inline-block', lineHeight: '31px', height: '31px', padding: '0 25px' }}>
            Abrir Livro de Monstros →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HomePage