import { Link } from 'react-router-dom'

function AboutPage() {
  return (
    <section className="app-about" style={{ maxWidth: '700px', width: '100%', margin: '40px auto 0' }} aria-labelledby="sobre-titulo">
      <div className="app-about__card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Título adaptado */}
        <h2 id="sobre-titulo" className="page-title" style={{ borderBottom: '1px solid rgba(74, 50, 24, 0.2)', paddingBottom: '10px' }}>
          Sobre o Projeto
        </h2>
        
        {/* Textos com alto contraste */}
        <p className="page-text">
          Este Bestiário interativo foi desenvolvido como projeto prático para a disciplina de 
          <strong> Programação Frontend</strong> na faculdade <strong>UNIVAS</strong>.
        </p>

        <p className="page-text">
          O objetivo principal foi consolidar os pilares fundamentais do desenvolvimento com 
          <strong> React</strong>, aplicando na prática os conceitos vistos em sala de aula e também no 
          projeto da Pokedex. Desenvolvido pela dupla <strong>Eduardo Leite</strong> & <strong>Mikael Augusto</strong>.
        </p>

        <div style={{ marginTop: '10px', borderTop: '1px solid rgba(74, 50, 24, 0.1)', paddingTop: '15px' }}>
          <Link to="/" className="back-link">
            ← Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AboutPage