import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { buscarCriaturaPorId } from '../services/bestiarioAPI'

// Função auxiliar para criar as siglas caso a API de D&D não tenha foto do monstro
function criarSigla(nome) {
  if (!nome) return ''
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

function MonstrosDetailPage() {
  const { id } = useParams() // Pega o "index" do monstro pela URL (ex: /monstro/beholder)
  const [monstro, setMonstro] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Função isolada para carregar ou recarregar os dados (usada também no "Tentar novamente")
  async function loadMonster(cancelled = false) {
    try {
      setLoading(true)
      setError(null)
      setMonstro(null) // Limpa o monstro anterior antes de buscar o novo
      
      const data = await buscarCriaturaPorId(id)
      
      if (!cancelled) setMonstro(data)
    } catch (err) {
      if (!cancelled) setError(err.message ?? 'Erro ao carregar o monstro.')
    } finally {
      if (!cancelled) setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    loadMonster(cancelled)

    return () => {
      cancelled = true
    }
  }, [id]) // Roda de novo automaticamente se o ID na URL mudar

  // 1. Estado de Carregamento
  if (loading) {
    return (
      <section className="bestiary-page" style={{ color: 'var(--gold-light)', padding: '50px', textAlign: 'center' }}>
        <p>Consultando o grimório de criaturas...</p>
      </section>
    )
  }

  // 2. Estado de Erro
  if (error) {
    return (
      <section className="bestiary-page" style={{ color: 'red', padding: '50px', textAlign: 'center' }}>
        <p role="alert">Ocorreu um erro: {error}</p>
        <button onClick={() => loadMonster(false)} className="info-button" style={{ marginTop: '15px' }}>
          Tentar novamente
        </button>
      </section>
    )
  }

  // 3. Estado de Monstro não encontrado (Tratamento para quando a API retorna null)
  if (!monstro) {
    return (
      <section className="bestiary-page" style={{ color: 'var(--gold-light)', padding: '50px', textAlign: 'center' }}>
        <p>Criatura "{id}" não encontrada no Tomo de D&D 5e.</p>
        
        {/* BOTÃO TENTAR NOVAMENTE */}
        <button onClick={() => loadMonster(false)} className="info-button" style={{ margin: '15px 0' }}>
          Tentar novamente
        </button> 
        <br />

        <Link to="/" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>
          Voltar ao bestiário
        </Link>
      </section>
    )
  }

  // 4. Tela de Detalhes com sucesso (Encontrou o monstro)
  return (
    <div className="bestiary-page">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">20</span>
          <span>
            <strong>Bestiário</strong>
            <small>Detalhes da Criatura</small>
          </span>
        </Link>
        <nav className="main-nav">
          <Link to="/">← Voltar ao Bestiário</Link>
        </nav>
      </header>

      <main className="scroll-frame" style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
        <article className="monster-card" style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px' }}>
          
          <div className="monster-portrait" style={{ alignSelf: 'center', width: '120px', height: '120px' }}>
            <span className="challenge-badge">
              ND <strong>{monstro.nivelDesafio}</strong>
            </span>
            {monstro.imageUrl ? (
              <img src={monstro.imageUrl} alt={monstro.nome} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span className="portrait portrait-1" style={{ fontSize: '2rem' }}>
                {criarSigla(monstro.nome)}
              </span>
            )}
          </div>

          <div className="monster-content" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--gold-light)', margin: '0 0 5px 0' }}>{monstro.nome}</h2>
            <strong style={{ color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {monstro.tipo} — {monstro.tamanho}
            </strong>
            
            <p style={{ fontStyle: 'italic', margin: '15px 0', color: '#a0a5b0' }}>
              "{monstro.resumo}"
            </p>

            {/* Atributos de Defesa e Movimento */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '6px', margin: '20px 0', textAlign: 'left' }}>
              <p style={{ margin: '5px 0' }}>🛡️ <strong>Classe de Armadura (CA):</strong> {monstro.ca}</p>
              <p style={{ margin: '5px 0' }}>❤️ <strong>Pontos de Vida (PV):</strong> {monstro.pv}</p>
              <p style={{ margin: '5px 0' }}>👣 <strong>Deslocamento:</strong> {monstro.deslocamento}</p>
              <p style={{ margin: '5px 0' }}>⚖️ <strong>Tendência:</strong> {monstro.tendencia}</p>
            </div>

            <div style={{ textAlign: 'left', marginTop: '20px' }}>
              <h3 style={{ color: 'var(--gold)' }}>Descrição do Bestiário:</h3>
              <p style={{ lineHeight: '1.6', color: '#614624' }}>
                {monstro.descricao || "Esta criatura é um mistério selvagem. Os detalhes de suas ações e lore adicionais podem ser consultados diretamente nos manuais oficiais de D&D 5e."}
              </p>
            </div>
          </div>

        </article>
      </main>
    </div>
  )
}

export default MonstrosDetailPage