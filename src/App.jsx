import { useMemo, useState } from 'react'
import { listarCriaturas, listarOpcoesDeFiltro } from './services/bestiarioAPI'
import './App.css'

const criaturas = listarCriaturas()
const filtrosIniciais = {
  nome: '',
  tipo: 'Todos',
  tamanho: 'Todos',
  nivelDesafio: 30,
}
const opcoesDeFiltro = {
  tipo: listarOpcoesDeFiltro('tipo'),
  tamanho: listarOpcoesDeFiltro('tamanho'),
}
const itensPorPagina = 9

function normalizarTexto(valor) {
  return String(valor)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function formatarNivelDesafio(nivelDesafio) {
  if (nivelDesafio === 0.125) return '1/8'
  if (nivelDesafio === 0.25) return '1/4'
  if (nivelDesafio === 0.5) return '1/2'
  return String(nivelDesafio)
}

function criarSigla(nome) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

function App() {
  const [filtros, setFiltros] = useState(filtrosIniciais)
  const [busca, setBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [criaturaSelecionadaId, setCriaturaSelecionadaId] = useState(criaturas[0]?.id)

  const criaturasFiltradas = useMemo(() => {
    const buscaNormalizada = normalizarTexto(busca)
    const nomeNormalizado = normalizarTexto(filtros.nome)

    return criaturas.filter((criatura) => {
      const nome = normalizarTexto(criatura.nome)
      const categoria = normalizarTexto(criatura.categoria)
      const correspondeBusca =
        !buscaNormalizada ||
        nome.includes(buscaNormalizada) ||
        categoria.includes(buscaNormalizada)
      const correspondeNome = !nomeNormalizado || nome.includes(nomeNormalizado)
      const correspondeTipo = filtros.tipo === 'Todos' || criatura.tipo === filtros.tipo
      const correspondeTamanho =
        filtros.tamanho === 'Todos' || criatura.tamanho === filtros.tamanho
      const correspondeNivel = criatura.nivelDesafio <= Number(filtros.nivelDesafio)

      return (
        correspondeBusca &&
        correspondeNome &&
        correspondeTipo &&
        correspondeTamanho &&
        correspondeNivel
      )
    })
  }, [busca, filtros])

  const totalPaginas = Math.max(1, Math.ceil(criaturasFiltradas.length / itensPorPagina))
  const criaturasPaginadas = criaturasFiltradas.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina,
  )
  const criaturaSelecionada = useMemo(() => {
    return (
      criaturasFiltradas.find((criatura) => criatura.id === criaturaSelecionadaId) ??
      criaturasFiltradas[0] ??
      null
    )
  }, [criaturaSelecionadaId, criaturasFiltradas])

  function atualizarFiltro(campo, valor) {
    setFiltros((filtrosAtuais) => ({
      ...filtrosAtuais,
      [campo]: valor,
    }))
    setPaginaAtual(1)
  }

  function atualizarBusca(valor) {
    setBusca(valor)
    setPaginaAtual(1)
  }

  function limparFiltros() {
    setFiltros(filtrosIniciais)
    setBusca('')
    setPaginaAtual(1)
    setCriaturaSelecionadaId(criaturas[0]?.id)
  }

  return (
    <div className="bestiary-page">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Página inicial do Bestiário">
          <span className="brand-mark">20</span>
          <span>
            <strong>Bestiário</strong>
            <small>Criaturas de D&amp;D 5e</small>
          </span>
        </a>

        <nav className="main-nav" aria-label="Navegação principal">
          <a href="/">Início</a>
          <a href="/">Busca avançada</a>
          <a href="/">Meu bestiário</a>
          <a href="/">Sobre</a>
        </nav>
      </header>

      <main className="scroll-frame">
        <section className="search-hero" aria-label="Busca de criaturas">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={busca}
              onChange={(event) => atualizarBusca(event.target.value)}
              placeholder="Buscar criatura (ex: Dragão Vermelho, Beholder, Goblin)..."
            />
          </label>
        </section>

        <section className="filter-panel" aria-label="Filtros do catálogo">
          <label className="field field-name">
            <span>☷ Nome</span>
            <input
              type="text"
              value={filtros.nome}
              onChange={(event) => atualizarFiltro('nome', event.target.value)}
              placeholder="Nome"
            />
          </label>

          <label className="field">
            <span>◆ Tipo</span>
            <select
              value={filtros.tipo}
              onChange={(event) => atualizarFiltro('tipo', event.target.value)}
            >
              <option>Todos</option>
              {opcoesDeFiltro.tipo.map((tipo) => (
                <option key={tipo}>{tipo}</option>
              ))}
            </select>
          </label>

          <label className="field challenge-field">
            <span>✦ Nível de desafio (0 - 30)</span>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={filtros.nivelDesafio}
              onChange={(event) => atualizarFiltro('nivelDesafio', event.target.value)}
            />
            <small>
              0 <b>5</b> <b>10</b> <b>20</b> <strong>{filtros.nivelDesafio}</strong>
            </small>
          </label>

          <label className="field">
            <span>↔ Tamanho</span>
            <select
              value={filtros.tamanho}
              onChange={(event) => atualizarFiltro('tamanho', event.target.value)}
            >
              <option>Todos</option>
              {opcoesDeFiltro.tamanho.map((tamanho) => (
                <option key={tamanho}>{tamanho}</option>
              ))}
            </select>
          </label>

          <button className="clear-button" type="button" onClick={limparFiltros}>
            Limpar
          </button>
        </section>

        <section className="creature-grid" aria-label="Lista de criaturas">
          {criaturasPaginadas.length > 0 ? (
            criaturasPaginadas.map((criatura) => (
              <article className="monster-card" key={criatura.id}>
                <div className="monster-portrait">
                  <span className="challenge-badge">
                    ND
                    <strong>{formatarNivelDesafio(criatura.nivelDesafio)}</strong>
                  </span>
                  <span className={`portrait portrait-${(criatura.id % 6) + 1}`}>
                    {criarSigla(criatura.nome)}
                  </span>
                </div>

                <div className="monster-content">
                  <h2>{criatura.nome}</h2>
                  <strong>
                    {criatura.tipo}, {criatura.tamanho}
                  </strong>
                  <p>{criatura.resumo}</p>
                  <small>
                    CA: {criatura.ca}, PV: {criatura.pv}, Des: {criatura.deslocamento}
                  </small>
                  <button
                    className="info-button"
                    type="button"
                    onClick={() => setCriaturaSelecionadaId(criatura.id)}
                  >
                    Mais Info
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <strong>Nenhuma criatura encontrada</strong>
              <p>Altere a busca ou os filtros para consultar o bestiário local.</p>
            </div>
          )}
        </section>

        <footer className="catalog-footer">
          <span>
            Mostrando {criaturasPaginadas.length} de {criaturasFiltradas.length}{' '}
            criaturas...
          </span>

          <div className="pagination" aria-label="Paginação">
            <button
              type="button"
              disabled={paginaAtual === 1}
              onClick={() => setPaginaAtual((pagina) => Math.max(1, pagina - 1))}
            >
              ‹
            </button>
            {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map(
              (pagina) => (
                <button
                  className={pagina === paginaAtual ? 'active' : ''}
                  type="button"
                  key={pagina}
                  onClick={() => setPaginaAtual(pagina)}
                >
                  {pagina}
                </button>
              ),
            )}
            <span>...</span>
            <button type="button" disabled>
              30
            </button>
            <button
              type="button"
              disabled={paginaAtual === totalPaginas}
              onClick={() =>
                setPaginaAtual((pagina) => Math.min(totalPaginas, pagina + 1))
              }
            >
              ›
            </button>
          </div>
        </footer>

        {criaturaSelecionada && (
          <aside className="quick-sheet" aria-label="Ficha rápida">
            <div>
              <span>Ficha rápida</span>
              <h2>{criaturaSelecionada.nome}</h2>
              <p>{criaturaSelecionada.descricao}</p>
            </div>
            <dl>
              <div>
                <dt>ND</dt>
                <dd>{formatarNivelDesafio(criaturaSelecionada.nivelDesafio)}</dd>
              </div>
              <div>
                <dt>CA</dt>
                <dd>{criaturaSelecionada.ca}</dd>
              </div>
              <div>
                <dt>PV</dt>
                <dd>{criaturaSelecionada.pv}</dd>
              </div>
              <div>
                <dt>Tendência</dt>
                <dd>{criaturaSelecionada.tendencia}</dd>
              </div>
            </dl>
          </aside>
        )}
      </main>

      <span className="corner corner-left" aria-hidden="true"></span>
      <span className="corner corner-right" aria-hidden="true"></span>
    </div>
  )
}

export default App
