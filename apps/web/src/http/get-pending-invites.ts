import { Role } from "@saas/auth"

import { api } from "./api-client"

interface GetPendingInvitesResponse {
  invites: {
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
  }[]
}

export async function getPendingInvites() {
  const response = await api
    .get(`pending-invites`)
    .json<GetPendingInvitesResponse>()

  return response
}
