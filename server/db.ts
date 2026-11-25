
export type Tarefa = {
  id: string          
  titulo: string      
  descricao?: string  
  dataCriacao: Date   
}

export let tarefas: Tarefa[] = [
  {
    id: '1',
    titulo: 'Estudar tRPC',
    descricao: 'Entender como funciona o roteador e os procedures',
    dataCriacao: new Date('2026-11-24T10:00:00'),
  },
  {
    id: '2',
    titulo: 'Fazer o desafio',
    descricao: undefined,
    dataCriacao: new Date('2026-11-24T11:00:00'),
  },
]
