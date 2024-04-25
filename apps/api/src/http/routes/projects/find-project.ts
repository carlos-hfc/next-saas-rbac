import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

import { auth } from "@/http/middlewares/auth"
import { prisma } from "@/lib/prisma"
import { getUserPermissions } from "@/utils/get-user-permissions"

import { BadRequest } from "../_errors/bad-request-error"
import { Unauthorized } from "../_errors/unauthorized-error"

export async function findProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/organizations/:slug/projects/:projectSlug",
      {
        schema: {
          tags: ["Projects"],
          summary: "Get project details",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            200: z.object({
              project: z.object({
                description: z.string(),
                slug: z.string(),
                id: z.string().uuid(),
                name: z.string(),
                avatarUrl: z.string().nullable(),
                ownerId: z.string().uuid(),
                organizationId: z.string(),
                owner: z.object({
                  id: z.string().uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().nullable(),
                }),
              }),
            }),
          },
        },
      },
      async request => {
        const { slug, projectSlug } = request.params

        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions({
          id: userId,
          role: membership.role,
        })

        if (cannot("get", "Project")) {
          throw new Unauthorized("You're not allowed to see this project")
        }

        const project = await prisma.project.findUnique({
          where: {
            slug: projectSlug,
            organizationId: organization.id,
          },
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            avatarUrl: true,
            ownerId: true,
            organizationId: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        })

        if (!project) {
          throw new BadRequest("Project not found")
        }

        return {
          project,
        }
      }
    )
}
