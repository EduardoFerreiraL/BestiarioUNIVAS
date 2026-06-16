import { mapMonsterFromApi } from '../utils/mapMonstros'

const BASE_URL = 'https://www.dnd5eapi.co/api'

// Função auxiliar para validar as respostas da API
async function parseResponse(res, msg) {
  if (!res.ok) throw new Error(msg)
  return res.json()
}

/* 1. LISTAR CRIATURAS
 buscar os 330 monstros da erro, sepá é pq a API dos caras bloqueia o acesso, então eu deixei o limite aqui p 60
 se quiser alterar tem q ir lá em App.jsx -> const dadosDaApi = await listarCriaturas(60) e mudar o num no parentese
 se aumentar p 80 ele demora 1-2 segundos p carregar a página mas vai, 100 ja tava mim bloqueando nessa bsota
 mas se tu quiser, vai na fé Du, aumenta p quantidade q quiser

 baixei dnv pq ta demorando uns 2 segundos p carregar no 60 e como eu so quero testar, uero velociodade
*/
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