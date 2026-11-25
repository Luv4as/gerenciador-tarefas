export type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  completada: boolean;
  dataCriacao: Date;
};

const globalForTarefas = globalThis as typeof globalThis & {
  __tarefas?: Tarefa[];
};

export const tarefas: Tarefa[] =
  globalForTarefas.__tarefas ??
  (globalForTarefas.__tarefas = []);
