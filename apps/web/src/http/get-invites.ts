import { Role } from "@saas/auth"

import { api } from "./api-client"

interface GetInvitesResponse {
  invites: {
    id: string
    email: string
    createdAt: string
    role: Role
    author: {
      id: string
      name: string | null
    } | null
  }[]
}

export async function getInvites(org: string) {
  const response = await api
    .get(`organizations/${org}/invites`, {
      next: {
        tags: [`${org}/invites`],
      },
    })
    .json<GetInvitesResponse>()

  return response
}
