import { api } from "./api-client"

interface RemoveMemberRequest {
  org: string
  memberId: string
}

type RemoveMemberResponse = void

export async function removeMember({
  org,
  memberId,
}: RemoveMemberRequest): Promise<RemoveMemberResponse> {
  await api.delete(`organizations/${org}/members/${memberId}`)
}
