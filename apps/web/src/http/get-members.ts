import { Role } from "@saas/auth"

import { api } from "./api-client"

interface GetMembersResponse {
  members: {
    userId: string
    id: string
    name: string | null
    avatarUrl: string | null
    email: string
    role: Role
  }[]
}

export async function getMembers(org: string) {
  const response = await api
    .get(`organizations/${org}/members`)
    .json<GetMembersResponse>()

  return response
}
