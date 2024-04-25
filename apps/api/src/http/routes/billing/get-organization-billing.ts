import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

import { auth } from "@/http/middlewares/auth"
import { prisma } from "@/lib/prisma"
import { getUserPermissions } from "@/utils/get-user-permissions"

import { Unauthorized } from "../_errors/unauthorized-error"

export async function getOrganizationBilling(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/organizations/:slug/billing",
      {
        schema: {
          tags: ["Billing"],
          summary: "Get billing information from organization",
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              billing: z.object({
                seats: z.object({
                  amount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                projects: z.object({
                  amount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                total: z.number(),
              }),
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

        if (cannot("get", "Billing")) {
          throw new Unauthorized(
            "You're not allowed to get billing details from this organization"
          )
        }

        const [amountMembers, amountProjects] = await Promise.all([
          prisma.member.count({
            where: {
              organizationId: organization.id,
              role: {
                not: "BILLING",
              },
            },
          }),
          prisma.project.count({
            where: {
              organizationId: organization.id,
            },
          }),
        ])

        return {
          billing: {
            seats: {
              amount: amountMembers,
              unit: 10,
              price: amountMembers * 10,
            },
            projects: {
              amount: amountProjects,
              unit: 20,
              price: amountProjects * 20,
            },
            total: amountMembers * 10 + amountProjects * 20,
          },
        }
      }
    )
}
