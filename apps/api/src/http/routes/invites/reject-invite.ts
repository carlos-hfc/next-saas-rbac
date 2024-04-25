import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

import { auth } from "@/http/middlewares/auth"
import { prisma } from "@/lib/prisma"

import { BadRequest } from "../_errors/bad-request-error"

export async function rejectInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/invites/:inviteId/reject",
      {
        schema: {
          tags: ["Invites"],
          summary: "Reject an invite",
          security: [{ bearerAuth: [] }],
          params: z.object({
            inviteId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { inviteId } = request.params

        const userId = await request.getCurrentUserId()

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
          },
        })

        if (!invite) {
          throw new BadRequest("Invite not found or expired")
        }

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new BadRequest("User not found")
        }

        if (invite.email !== user.email) {
          throw new BadRequest("This invite belongs to another user")
        }

        await prisma.invite.delete({
          where: {
            id: inviteId,
          },
        })

        reply.status(204).send()
      }
    )
}
