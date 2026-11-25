import { initTRPC } from '@trpc/server'
import { ZodError } from 'zod'

export type Context = Record<string, never>

export function createContext(): Context {
  return {}
}

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    const validationMessage =
      error.cause instanceof ZodError
        ? error.cause.issues[0]?.message
        : undefined

    return {
      ...shape,
      message: validationMessage ?? shape.message,
    }
  },
})

export const router = t.router
export const publicProcedure = t.procedure
export const createCallerFactory = t.createCallerFactory
