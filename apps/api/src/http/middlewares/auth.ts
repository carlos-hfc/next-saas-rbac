import fastifyPlugin from "fastify-plugin"

import { Unauthorized } from "../routes/_errors/unauthorized-error"

export const auth = fastifyPlugin(async app => {
  app.addHook("preHandler", async request => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch (error) {
        throw new Unauthorized("Invalid auth token")
      }
    }
  })
})
