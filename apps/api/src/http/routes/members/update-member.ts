import { roleSchema } from "@saas/auth"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

import { auth } from "@/http/middlewares/auth"
import { prisma } from "@/lib/prisma"
import { getUserPermissions } from "@/utils/get-user-permissions"

import { BadRequest } from "../_errors/bad-request-error"
import { Unauthorized } from "../_errors/unauthorized-error"

export async function updateMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/organizations/:slug/members/:memberId",
      {
        schema: {
          tags: ["Members"],
          summary: "Update a member",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string().uuid(),
          }),
          body: z.object({
            role: roleSchema,
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params

        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const member = await prisma.member.findUnique({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
        })

        if (!member) {
          throw new BadRequest("Member not found")
        }

        const { cannot } = getUserPermissions({
          id: userId,
          role: membership.role,
        })

        if (cannot("update", "User")) {
          throw new Unauthorized("You're not allowed to update this member")
        }

        const { role } = request.body

        await prisma.member.update({
          where: {
            id: memberId,
          },
          data: {
            role,
          },
        })

        reply.status(204).send()
      }
    )
}
