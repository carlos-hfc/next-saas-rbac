import { roleSchema } from "@saas/auth"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

import { prisma } from "@/lib/prisma"

import { BadRequest } from "../_errors/bad-request-error"

export async function findInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/invites/:inviteId",
    {
      schema: {
        tags: ["Invites"],
        summary: "Get invite details",
        params: z.object({
          inviteId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            invite: z.object({
              id: z.string().uuid(),
              email: z.string(),
              createdAt: z.date(),
              role: roleSchema,
              organization: z.object({
                name: z.string(),
              }),
              author: z
                .object({
                  id: z.string().uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().url().nullable(),
                })
                .nullable(),
            }),
          }),
        },
      },
    },
    async request => {
      const { inviteId } = request.params

      const invite = await prisma.invite.findUnique({
        where: {
          id: inviteId,
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          organization: {
            select: {
              name: true,
            },
          },
        },
      })

      if (!invite) {
        throw new BadRequest("Invite not found")
      }

      return {
        invite,
      }
    }
  )
}
