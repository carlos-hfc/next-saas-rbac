import fastifyCors from "@fastify/cors"
import fastifyJwt from "@fastify/jwt"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { env } from "@saas/env"
import { fastify } from "fastify"
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod"

import { errorHandler } from "./error-handler"
import { authenticateWithGithub } from "./routes/auth/authenticate-with-github"
import { authenticateWithPassword } from "./routes/auth/authenticate-with-password"
import { createAccount } from "./routes/auth/create-account"
import { getProfile } from "./routes/auth/get-profile"
import { requestPasswordRecover } from "./routes/auth/request-password-recover"
import { resetPassword } from "./routes/auth/reset-password"
import { getOrganizationBilling } from "./routes/billing/get-organization-billing"
import { acceptInvite } from "./routes/invites/accept-invite"
import { createInvite } from "./routes/invites/create-invite"
import { findInvite } from "./routes/invites/find-invite"
import { getInvites } from "./routes/invites/get-invites"
import { getPendingInvites } from "./routes/invites/get-pending-invite"
import { rejectInvite } from "./routes/invites/reject-invite"
import { revokeInvite } from "./routes/invites/revoke-invite"
import { getMembers } from "./routes/members/get-members"
import { removeMember } from "./routes/members/remove-member"
import { updateMember } from "./routes/members/update-member"
import { createOrganization } from "./routes/orgs/create-organization"
import { findOrganization } from "./routes/orgs/find-organization"
import { getMembership } from "./routes/orgs/get-membership"
import { getOrganizations } from "./routes/orgs/get-organizations"
import { shutdownOrganization } from "./routes/orgs/shutdown-organization"
import { transferOrganization } from "./routes/orgs/transfer-organization"
import { updateOrganization } from "./routes/orgs/update-organization"
import { createProject } from "./routes/projects/create-project"
import { deleteProject } from "./routes/projects/delete-project"
import { findProject } from "./routes/projects/find-project"
import { getProjects } from "./routes/projects/get-projects"
import { updateProject } from "./routes/projects/update-project"

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifyCors)
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Next.js SaaS",
      description: "Full-stack SaaS app with multi-tenant & RBAC.",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "Bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(authenticateWithGithub)

app.register(createOrganization)
app.register(getMembership)
app.register(findOrganization)
app.register(getOrganizations)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganization)

app.register(createProject)
app.register(deleteProject)
app.register(findProject)
app.register(getProjects)
app.register(updateProject)

app.register(getMembers)
app.register(updateMember)
app.register(removeMember)

app.register(createInvite)
app.register(findInvite)
app.register(getInvites)
app.register(acceptInvite)
app.register(rejectInvite)
app.register(revokeInvite)
app.register(getPendingInvites)

app.register(getOrganizationBilling)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log(`HTTP server running!`)
})
