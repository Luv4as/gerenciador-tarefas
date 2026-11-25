export type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  completada: boolean;
  dataCriacao: Date;
};

const initialTarefas: Tarefa[] = [
  {
    id: "1",
    titulo: "Estudar tRPC",
    descricao: "Entender como funciona o roteador e os procedures",
    completada: false,
    dataCriacao: new Date("2026-11-24T10:00:00"),
  },
  {
    id: "2",
    titulo: "Fazer o desafio",
    descricao: undefined,
    completada: false,
    dataCriacao: new Date("2026-11-24T11:00:00"),
  },
];

const globalForTarefas = globalThis as typeof globalThis & {
  __tarefas?: Tarefa[];
};

export const tarefas: Tarefa[] =
  globalForTarefas.__tarefas ??
  (globalForTarefas.__tarefas = [...initialTarefas]);
