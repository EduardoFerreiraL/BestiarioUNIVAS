import { mapMonsterFromApi } from '../utils/mapMonstros'

const BASE_URL = 'https://www.dnd5eapi.co/api'

// Função auxiliar para validar as respostas da API
async function parseResponse(res, msg) {
  if (!res.ok) throw new Error(msg)
  return res.json()
}

// 1. LISTAR CRIATURAS (Substitui sua função antiga)
// Como buscar todos os monstros com detalhes de uma vez deixaria o site muito pesado, 
// limitamos a buscar os primeiros 30 monstros detalhados por padrão para testes.
export async function listarCriaturas(limit = 30) {
  const listRes = await fetch(`${BASE_URL}/monsters`)
  const listData = await parseResponse(listRes, 'Não foi possível carregar a lista de monstros.')
  
  // Pegamos apenas a quantidade definida no limite para não estourar a rede
  const monstrosReduzidos = listData.results.slice(0, limit)

  // Faz um fetch detalhado para cada monstro da lista e aplica o MAP
  return Promise.all(
    monstrosReduzidos.map(async (item) => {
      const detRes = await fetch(`${BASE_URL}/monsters/${item.index}`)
      const detData = await parseResponse(detRes, `Não foi possível carregar detalhes de ${item.name}.`)
      return mapMonsterFromApi(detData)
    })
  )
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