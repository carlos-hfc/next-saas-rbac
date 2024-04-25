import { roleSchema } from "@saas/auth"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

import { auth } from "@/http/middlewares/auth"
import { prisma } from "@/lib/prisma"
import { getUserPermissions } from "@/utils/get-user-permissions"

import { Unauthorized } from "../_errors/unauthorized-error"

export async function getMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/organizations/:slug/members",
      {
        schema: {
          tags: ["Members"],
          summary: "Get all organization members",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  userId: z.string().uuid(),
                  id: z.string().uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().url().nullable(),
                  email: z.string(),
                  role: roleSchema,
                })
              ),
            }),
          },
        },
      },
      async request => {
        const { slug } = request.params

        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions({
          id: userId,
          role: membership.role,
        })

        if (cannot("get", "User")) {
          throw new Unauthorized(
            "You're not allowed to see organization members"
          )
        }

        const members = await prisma.member.findMany({
          where: {
            organizationId: organization.id,
          },
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            role: "asc",
          },
        })

        return {
          members: members.map(
            ({ user: { id: userId, ...user }, ...member }) => ({
              ...member,
              ...user,
              userId,
            })
          ),
        }
      }
    )
}
