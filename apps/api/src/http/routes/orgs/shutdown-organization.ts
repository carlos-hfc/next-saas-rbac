import { organizationSchema } from "@saas/auth"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

import { auth } from "@/http/middlewares/auth"
import { prisma } from "@/lib/prisma"
import { getUserPermissions } from "@/utils/get-user-permissions"

import { Unauthorized } from "../_errors/unauthorized-error"

export async function shutdownOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      "/organizations/:slug",
      {
        schema: {
          tags: ["Organization"],
          summary: "Shutdown organization",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermissions({
          id: userId,
          role: membership.role,
        })

        if (cannot("delete", authOrganization)) {
          throw new Unauthorized(
            "You're not allowed to shutdown this organization"
          )
        }

        await prisma.organization.delete({
          where: {
            id: organization.id,
          },
        })

        reply.status(204).send()
      }
    )
}
