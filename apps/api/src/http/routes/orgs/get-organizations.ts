import { roleSchema } from "@saas/auth"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

import { auth } from "@/http/middlewares/auth"
import { prisma } from "@/lib/prisma"

export async function getOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/organizations",
      {
        schema: {
          tags: ["Organization"],
          summary: "Get organizations where user is a member",
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  role: roleSchema,
                  id: z.string(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().nullable(),
                })
              ),
            }),
          },
        },
      },
      async request => {
        const userId = await request.getCurrentUserId()

        const organizations = await prisma.organization.findMany({
          where: {
            members: {
              some: {
                userId,
              },
            },
          },
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            members: {
              select: {
                role: true,
              },
              where: {
                userId,
              },
            },
          },
        })

        return {
          organizations: organizations.map(({ members, ...org }) => ({
            ...org,
            role: members[0].role,
          })),
        }
      }
    )
}
