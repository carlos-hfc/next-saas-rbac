import { Role } from "@saas/auth"

import { api } from "./api-client"

interface UpdateMemberRequest {
  org: string
  memberId: string
  role: Role
}

type UpdateMemberResponse = void

export async function updateMember({
  org,
  memberId,
  role,
}: UpdateMemberRequest): Promise<UpdateMemberResponse> {
  await api.put(`organizations/${org}/members/${memberId}`, {
    body: JSON.stringify({
      role,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
}
