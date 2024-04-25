import { projectSchema } from "@saas/auth"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

import { auth } from "@/http/middlewares/auth"
import { prisma } from "@/lib/prisma"
import { getUserPermissions } from "@/utils/get-user-permissions"

import { BadRequest } from "../_errors/bad-request-error"
import { Unauthorized } from "../_errors/unauthorized-error"

export async function deleteProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      "/organizations/:slug/projects/:projectId",
      {
        schema: {
          tags: ["Projects"],
          summary: "Delete a project",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            projectId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, projectId } = request.params

        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const project = await prisma.project.findUnique({
          where: {
            id: projectId,
            organizationId: organization.id,
          },
        })

        if (!project) {
          throw new BadRequest("Project not found")
        }

        const { cannot } = getUserPermissions({
          id: userId,
          role: membership.role,
        })
        const authProject = projectSchema.parse(project)

        if (cannot("delete", authProject)) {
          throw new Unauthorized("You're not allowed to delete this project")
        }

        await prisma.project.delete({
          where: {
            id: projectId,
          },
        })

        reply.status(204).send()
      }
    )
}
