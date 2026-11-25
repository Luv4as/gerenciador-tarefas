import { createCallerFactory } from '@/server/trpc'
import { appRouter } from '@/server/routers/_app'
import { createContext } from '@/server/trpc'

const caller = createCallerFactory(appRouter)

export const serverTrpc = caller(createContext)
