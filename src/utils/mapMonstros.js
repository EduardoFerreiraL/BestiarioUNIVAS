// Dicionários para tradução dos dados que vêm em inglês da API de D&D 5e
const TRADUCOES_TIPO = {
  aberration: 'Aberração', beast: 'Fera', celestial: 'Celestial',
  construct: 'Constructo', dragon: 'Dragão', elemental: 'Elemental',
  fey: 'Fada', fiend: 'Infernal', giant: 'Gigante',
  humanoid: 'Humanoide', monstrosity: 'Monstruosidade', ooze: 'Lodo',
  plant: 'Planta', undead: 'Morto-vivo'
}

const TRADUCOES_TAMANHO = {
  Tiny: 'Miúdo', Small: 'Pequeno', Medium: 'Médio',
  Large: 'Grande', Huge: 'Enorme', Gargantuan: 'Colossal'
}

const TRADUCOES_TENDENCIA = {
  'lawful good': 'Leal e bom', 'neutral good': 'Neutro e bom', 'chaotic good': 'Caótico e bom',
  'lawful neutral': 'Leal e neutro', 'neutral': 'Neutro', 'chaotic neutral': 'Caótico e neutro',
  'lawful evil': 'Leal e mau', 'neutral evil': 'Neutro e mau', 'chaotic evil': 'Caótico e mau',
  'unaligned': 'Sem alinhamento', 'any alignment': 'Qualquer alinhamento'
}

// Função auxiliar para capitalizar nomes próprios
const capitalize = n => n.charAt(0).toUpperCase() + n.slice(1)

// Mapeia os dados básicos para a LISTA de criaturas da sua tela
export function mapMonsterFromApi(apiData) {
  // Traduz o tipo ou mantém o original capitalizado se não achar no dicionário
  const tipoOriginal = apiData.type?.toLowerCase()
  const tipo = TRADUCOES_TIPO[tipoOriginal] ?? capitalize(apiData.type || 'Desconhecido')

  // Traduz o tamanho
  const tamanho = TRADUCOES_TAMANHO[apiData.size] ?? apiData.size

  // Traduz a tendência
  const tendenciaOriginal = apiData.alignment?.toLowerCase()
  const tendencia = TRADUCOES_TENDENCIA[tendenciaOriginal] ?? capitalize(apiData.alignment || 'Sem alinhamento')

  // Formata o deslocamento (Ex: "walk: 30 ft, fly: 60 ft" vira "9 m, voo 18 m")
  // Nota: No D&D 5e, para converter pés (ft) para metros (m), dividimos por 3.3 ou multiplicamos por 0.3, mas o padrão do livro é 5ft = 1.5m.
  let deslocamentoArr = []
  if (apiData.speed?.walk) deslocamentoArr.push(`${parseInt(apiData.speed.walk) / 5 * 1.5} m`)
  if (apiData.speed?.fly) deslocamentoArr.push(`voo ${parseInt(apiData.speed.fly) / 5 * 1.5} m`)
  if (apiData.speed?.swim) deslocamentoArr.push(`natação ${parseInt(apiData.speed.swim) / 5 * 1.5} m`)
  const deslocamento = deslocamentoArr.length > 0 ? deslocamentoArr.join(', ') : '0 m'

  // Monta a URL da imagem. A API do D&D fornece uma propriedade image relativa (ex: /api/images/monsters/vampire.png)
  const imageUrl = apiData.image 
    ? `https://www.dnd5eapi.co${apiData.image}`
    : null // Se não tiver imagem na API, seu React pode exibir a sigla do monstro

  return {
    id: apiData.index, // Usamos o "index" da API (ex: "acolyte", "adult-red-dragon") como ID único textual
    nome: apiData.name, // Alguns nomes você pode traduzir manualmente se quiser, mas aqui mantemos o padrão da API
    tipo,
    categoria: tipo, // Ajustado para manter compatibilidade com seus filtros antigos
    tamanho,
    nivelDesafio: apiData.challenge_rating,
    ca: apiData.armor_class?.[0]?.value ?? 10, // Pega o valor da primeira armadura listada
    pv: apiData.hit_points,
    deslocamento,
    tendencia,
    bioma: 'Desconhecido', // A API de D&D 5e infelizmente não lista biomas diretamente no JSON de monstros
    resumo: `${tipo} ${tamanho}. Nível de Desafio ${apiData.challenge_rating}.`,
    imageUrl,
    descricao: '' // Será preenchida em detalhes se necessário, ou gerada dinamicamente
  }
}