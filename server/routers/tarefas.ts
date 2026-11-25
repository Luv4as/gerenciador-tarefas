import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure } from '../trpc'
import { tarefas } from '../db'

const criarTarefaSchema = z.object({
  titulo: z
    .string()
    .min(1, 'O título não pode estar vazio.')
    .max(100, 'O título pode ter no máximo 100 caracteres.'),
  descricao: z
    .string()
    .max(500, 'A descrição pode ter no máximo 500 caracteres.')
    .optional(),
})

const atualizarTarefaSchema = z.object({
  id: z.string().min(1, 'O id é obrigatório.'),
  titulo: z
    .string()
    .min(1, 'O título não pode estar vazio.')
    .max(100, 'O título pode ter no máximo 100 caracteres.')
    .optional(),
  descricao: z
    .string()
    .max(500, 'A descrição pode ter no máximo 500 caracteres.')
    .optional(),
})

const atualizarStatusTarefaSchema = z.object({
  id: z.string().min(1, 'O id é obrigatório.'),
  completada: z.boolean(),
})


export const tarefasRouter = router({
  listar: publicProcedure.query(() => {
    return [...tarefas]
  }),


  criar: publicProcedure
    .input(criarTarefaSchema)
    .mutation(({ input }) => {
      const novaTarefa = {
        id: crypto.randomUUID(),
        titulo: input.titulo,
        descricao: input.descricao,
        completada: false,
        dataCriacao: new Date(),
      }

      tarefas.push(novaTarefa)

      return novaTarefa
    }),


  atualizar: publicProcedure
    .input(atualizarTarefaSchema)
    .mutation(({ input }) => {
      const indice = tarefas.findIndex((t) => t.id === input.id)

      if (indice === -1) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Tarefa com id "${input.id}" não encontrada.`,
        })
      }

      const tarefa = tarefas[indice]

      if (input.titulo !== undefined) {
        tarefa.titulo = input.titulo
      }

      if (input.descricao !== undefined) {
        tarefa.descricao = input.descricao
      }

      return tarefa
    }),

  atualizarStatus: publicProcedure
    .input(atualizarStatusTarefaSchema)
    .mutation(({ input }) => {
      const indice = tarefas.findIndex((t) => t.id === input.id)

      if (indice === -1) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Tarefa com id "${input.id}" não encontrada.`,
        })
      }

      const tarefa = tarefas[indice]
      tarefa.completada = input.completada

      return tarefa
    }),

  deletar: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const indice = tarefas.findIndex((t) => t.id === input.id)

      if (indice === -1) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Tarefa com id "${input.id}" não encontrada.`,
        })
      }

      const [removida] = tarefas.splice(indice, 1)

      return removida
    }),
})
