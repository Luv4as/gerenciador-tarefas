import { router } from '../trpc'
import { tarefasRouter } from './tarefas'

export const appRouter = router({
  tarefa: tarefasRouter,
})

export type AppRouter = typeof appRouter
