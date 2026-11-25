# Gerenciador de tarefas

Lucas Venancio

Aplicação de demonstração para criar, listar, editar, concluir e excluir tarefas. O projeto foi desenvolvido com Next.js 15, React, TypeScript e tRPC; os dados ficam em memória, sem banco de dados ou serviços externos.

## Requisitos

- Node.js 20 ou superior (recomendado). O Next.js 15 também aceita Node.js 18.18+ e 19.8+.
- npm.

## Como executar

Clone o repositório e entre na pasta do projeto:

```bash
git clone https://github.com/Luv4as/gerenciador-tarefas.git
cd gerenciador-tarefas
```

Instale as dependências usando o lockfile:

```bash
npm ci
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Não é necessário criar um arquivo `.env` para executar o projeto.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run lint` | Executa o ESLint. |
| `npm run build` | Gera a build de produção. |
| `npm run start` | Inicia a aplicação já compilada; execute `npm run build` antes. |

## Tecnologias e versões

Versões resolvidas pelo `package-lock.json`:

| Tecnologia ou biblioteca | Versão | Uso |
| --- | --- | --- |
| Next.js | 15.5.29 | App Router, renderização no servidor e endpoints. |
| React / React DOM | 19.3.0 | Interface e componentes. |
| TypeScript | 5.9.3 | Tipagem estática. |
| tRPC | 11.31.3 | Comunicação tipada entre frontend e backend. |
| Zod | 4.6.7 | Validação dos dados recebidos pelo backend. |
| Tailwind CSS | 4.3.3 | Estilização utilitária. |
| `@tailwindcss/postcss` / PostCSS | 4.3.3 / 8.5.23 | Processamento do Tailwind CSS. |
| Base UI | 1.9.0 | Primitivos acessíveis para componentes de interface. |
| shadcn | 4.23.0 | Base e ferramentas dos componentes locais de UI. |
| Lucide React | 1.80.0 | Ícones. |
| class-variance-authority / `cn` | 0.7.1 / 0.5.2 | Variações e composição de classes. |
| ESLint / `eslint-config-next` | 9.39.5 / 15.5.29 | Análise estática e regras do Next.js. |

## Funcionalidades

- Listagem inicial carregada no servidor.
- Criação em formulário modal e edição diretamente no cartão da tarefa.
- Exclusão e alteração do status de conclusão.
- Ordenação por data de criação e por título.
- Validação do título e da descrição no frontend e no backend.
- Rolagem infinita.
- Feedback de carregamento, sucesso e erro nas operações.

**Sobre a rolagem infinita:** atualmente, a lista completa é carregada no servidor; os lotes de 10 controlam a quantidade de cartões exibidos no navegador. Não há paginação na API tRPC.

## Organização do projeto

```text
app/
  api/trpc/[trpc]/route.ts   # Adaptador HTTP do tRPC
  components/                # Lista, cartão, formulário e filtro de tarefas
  page.tsx                   # Página principal e carregamento inicial no servidor
  globals.css                # Estilos globais e tema Tailwind
components/ui/               # Componentes de interface reutilizáveis
lib/trpc/                    # Clientes tRPC para servidor e navegador
server/
  routers/tarefas.ts         # Operações e validações das tarefas
  db.ts                      # Modelo e armazenamento em memória
```

O router tRPC expõe `listar`, `criar`, `atualizar`, `atualizarStatus` e `deletar` no endpoint `/api/trpc`.

## Dados e limitações

As tarefas são mantidas em uma lista em memória em `server/db.ts`, com alguns registros fictícios iniciais. Os dados não são persistidos e podem ser perdidos ao reiniciar o processo. As operações tRPC são públicas e não há autenticação; isso foi feito para atender ao escopo do desafio pedido.

## Notas sobre decisões de implementação

- Pensei em adicionar uma sidebar para as duas telas, porém achei que seria desnecessário e seria uma redundância na UI.
- O mesmo vale para edição e criação de tarefas. Invés de criar uma tela inteira somente com poucos campos não me pareceu uma implementação eficiente, por isso escolhi usar um modal para a criação e a edição no mesmo componente da tarefa.
- Escolhi fazer um filtro para deixar mais organizada a lista de tarefas, principalmente por poder filtrar qual é mais recente e qual a mais antiga
- Para deixar mais compatível com possíveis necessidades do usuário decidi colocar um checkbox para o usuário poder colocar a tarefa como concluída. Ele também pode apagar a tarefa depois de concluída, porém considerei o caso do usuário querer manter o histórico de tarefas completas.
- Adicionei contadores de caracteres nos inputs. Assim, quando o usuário receber erro pela quantidade de caracteres ser maior do que o permitido, ele pode ir escrever com o limite em mente.
- Aviso: O projeto usa versão 15 do Next.js pois no enunciado do desafio diz "criar uma aplicação NextJS (v15)".