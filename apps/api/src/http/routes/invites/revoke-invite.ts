import {} from "@saas/auth"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

import { auth } from "@/http/middlewares/auth"
import { prisma } from "@/lib/prisma"
import { getUserPermissions } from "@/utils/get-user-permissions"

import { BadRequest } from "../_errors/bad-request-error"
import { Unauthorized } from "../_errors/unauthorized-error"

export async function revokeInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      "/organizations/:slug/invites/:revokeId",
      {
        schema: {
          tags: ["Invites"],
          summary: "Revoke an invite",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            inviteId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, inviteId } = request.params

        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions({
          id: userId,
          role: membership.role,
        })

        if (cannot("delete", "Invite")) {
          throw new Unauthorized("You're not allowed to delete an invite")
        }

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
            organizationId: organization.id,
          },
        })

        if (!invite) {
          throw new BadRequest("Invite not found")
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
