# Bestiário D&D 5e

## Alunos

* Eduardo Leite
* Mikael Augusto

## API Utilizada

Este projeto utiliza a API pública **D&D 5e API**, responsável por fornecer informações sobre monstros, criaturas e demais elementos do universo de Dungeons & Dragons 5ª Edição.

## Instalação e Execução

### Pré-requisitos

* Node.js instalado (versão 18 ou superior recomendada)
* npm instalado

### Passos para executar localmente

1. Clone o repositório ou extraia os arquivos do projeto.

2. Acesse a pasta do projeto:

```bash
cd BestiarioUnivas/
```

3. Instale as dependências:

```bash
npm install
```

4. Execute o projeto em modo de desenvolvimento:

```bash
npm run dev
```

5. Abra o navegador no endereço informado pelo Vite (normalmente):

```text
http://localhost:5173
```

## Funcionalidades Implementadas

* Consulta de monstros diretamente da API D&D 5e.
* Listagem paginada de criaturas.
* Busca de monstros por nome.
* Filtros por:

  * Tipo da criatura;
  * Tamanho;
  * Nível de Desafio (ND).
* Página de detalhes para cada monstro.
* Navegação entre páginas utilizando React Router.
* Tratamento de estados de carregamento e erro.
* Interface temática inspirada em bestiários de fantasia.

## Tecnologias Utilizadas

* React
* Vite
* React Router DOM
* JavaScript (ES6+)
* CSS

## Documentação da API

Documentação oficial da D&D 5e API:

https://www.dnd5eapi.co/docs/
