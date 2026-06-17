import { useMemo, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { listarCriaturas, listarOpcoesDeFiltro } from './services/bestiarioAPI'
import './App.css'

// Páginas
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import MonstrosDetailPage from './pages/MonstrosDetailPage'
import NotFoundPage from './pages/NotFoundPage'

// Componentes Reutilizáveis Isolados
import Header from './components/Header'
import MonsterCard from './components/MonsterCard'

const filtrosIniciais = {
  nome: '',
  tipo: 'Todos',
  tamanho: 'Todos',
  nivelDesafio: 30,
}

const itensPorPagina = 9

function normalizarTexto(valor) {
  return String(valor)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function CatalogoPage() {
  const [criaturas, setCriaturas] = useState([]) 
  const [carregando, setCarregando] = useState(true)
  const [filtros, setFiltros] = useState(filtrosIniciais)
  const [busca, setBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  
  useEffect(() => {
    async function carregarMonstros() {
      try {
        setCarregando(true)
        const dadosDaApi = await listarCriaturas(30)
        setCriaturas(dadosDaApi) 
      } catch (erro) {
        console.error("Erro ao carregar o bestiário da API:", erro)
      } finally {
        setCarregando(false) 
      }
    }
    carregarMonstros()
  }, [])

  const opcoesDeFiltro = useMemo(() => {
    return {
      tipo: listarOpcoesDeFiltro(criaturas, 'tipo'),
      tamanho: listarOpcoesDeFiltro(criaturas, 'tamanho'),
    }
  }, [criaturas])

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
  }, [busca, filtros, criaturas])

  const totalPaginas = Math.max(1, Math.ceil(criaturasFiltradas.length / itensPorPagina))
  const criaturasPaginadas = criaturasFiltradas.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina,
  )

  function atualizarFiltro(campo, valor) {
    setFiltros((filtrosAtuais) => ({ ...filtrosAtuais, [campo]: valor }))
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
  }
  
  if (carregando) {
    return (
      <div style={{ color: '#2d2118', padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Consultando pergaminhos do D&amp;D 5e...</h2>
      </div>
    )
  }

  return (
    <>
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
            <MonsterCard key={criatura.id} criatura={criatura} />
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
          Mostrando {criaturasPaginadas.length} de {criaturasFiltradas.length} criaturas...
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
          <button type="button" disabled>30</button>
          <button
            type="button"
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPaginaAtual((pagina) => Math.min(totalPaginas, pagina + 1))}
          >
            ›
          </button>
        </div>
      </footer>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="bestiary-page">
        
        {/* Usando o componente Header extraído */}
        <Header />

        <main className="scroll-frame">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/monstros" element={<CatalogoPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/monstro/:id" element={<MonstrosDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <span className="corner corner-left" aria-hidden="true"></span>
        <span className="corner corner-right" aria-hidden="true"></span>
      </div>
    </BrowserRouter>
  )
}

export default App