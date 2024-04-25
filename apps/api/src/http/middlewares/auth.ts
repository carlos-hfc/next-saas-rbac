import fastifyPlugin from "fastify-plugin"

import { prisma } from "@/lib/prisma"

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

    request.getUserMembership = async (slug: string) => {
      const userId = await request.getCurrentUserId()
      const member = await prisma.member.findFirst({
        where: {
          userId,
          organization: {
            slug,
          },
        },
        include: {
          organization: true,
        },
      })

      if (!member) {
        throw new Unauthorized("You're not a member of this organization")
      }

      const { organization, ...membership } = member

      return {
        organization,
        membership,
      }
    }
  })
})
