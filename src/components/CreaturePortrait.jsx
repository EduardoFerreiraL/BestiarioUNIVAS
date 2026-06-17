import { useState } from 'react'

function criarSigla(nome) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

export default function CreaturePortrait({ criatura }) {
  const [imageFailed, setImageFailed] = useState(false)
  const portraitClass = `portrait portrait-${(criatura.id.length % 6) + 1}`

  if (!criatura.imageUrl || imageFailed) {
    return (
      <span className={portraitClass}>
        {criarSigla(criatura.nome)}
      </span>
    )
  }

  return (
    <img
      className="portrait-image"
      src={criatura.imageUrl}
      alt={criatura.nome}
      loading="lazy"
      onError={() => setImageFailed(true)}
    />
  )
}