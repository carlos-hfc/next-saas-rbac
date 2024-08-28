import { Role } from "@saas/auth"

import { api } from "./api-client"

interface GetInviteResponse {
  invite: {
    id: string
    email: string
    createdAt: string
    role: Role
    organization: {
      name: string
    }
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
  }
}

export async function getInvite(inviteId: string) {
  const response = await api
    .get(`invites/${inviteId}`)
    .json<GetInviteResponse>()

  return response
}
