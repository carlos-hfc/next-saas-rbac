import { Role } from "@saas/auth"

import { api } from "./api-client"

interface GetMembershipResponse {
  membership: {
    id: string
    userId: string
    organizationId: string
    role: Role
  }
}

export async function getMembership(org: string) {
  const response = await api
    .get(`organizations/${org}/membership`)
    .json<GetMembershipResponse>()

  return response
}
