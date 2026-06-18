import { mapMonsterFromApi } from '../utils/mapMonstros'

const BASE_URL = 'https://www.dnd5eapi.co/api'

// Função auxiliar para validar as respostas da API
async function parseResponse(res, msg) {
  if (!res.ok) throw new Error(msg)
  return res.json()
}

let indiceMonstrosCache = null

async function obterIndiceMonstros() {
  if (!indiceMonstrosCache) {
    const listRes = await fetch(`${BASE_URL}/monsters`)
    indiceMonstrosCache = await parseResponse(listRes, 'Não foi possível carregar a lista de monstros.')
  }
  return indiceMonstrosCache
}

/* 1. LISTAR CRIATURAS
 Busca o índice completo uma vez (cache) e carrega os detalhes apenas do lote da página atual.
 Ex.: listarCriaturas(1, 30) → criaturas 1–30; listarCriaturas(2, 30) → criaturas 31–60.
 Evita estourar a rede com centenas de fetches de uma só vez.
*/
export async function listarCriaturas(pagina = 1, porPagina = 30) {
  const { count, results } = await obterIndiceMonstros()
  const inicio = (pagina - 1) * porPagina
  const lote = results.slice(inicio, inicio + porPagina)

  const criaturas = await Promise.all(
    lote.map(async (item) => {
      const detRes = await fetch(`${BASE_URL}/monsters/${item.index}`)
      const detData = await parseResponse(detRes, `Não foi possível carregar detalhes de ${item.name}.`)
      return mapMonsterFromApi(detData)
    })
  )

  return { criaturas, total: count }
}

// 2. BUSCAR CRIATURA POR ID / INDEX
export async function buscarCriaturaPorId(id) {
  const res = await fetch(`${BASE_URL}/monsters/${id}`)
  if (res.status === 404) return null
  const data = await parseResponse(res, 'Não foi possível carregar o monstro selecionado.')
  return mapMonsterFromApi(data)
}

// 3. LISTAR OPÇÕES DE FILTRO
// Como os dados agora são dinâmicos e assíncronos, precisamos passar a lista de criaturas carregadas
// para extrair as opções do filtro.
export function listarOpcoesDeFiltro(criaturasLista, campo) {
  if (!criaturasLista || criaturasLista.length === 0) return []
  return [...new Set(criaturasLista.map((criatura) => criatura[campo]))].sort()
}