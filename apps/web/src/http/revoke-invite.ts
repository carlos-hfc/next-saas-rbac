import { api } from "./api-client"

interface RevokeInviteRequest {
  org: string
  inviteId: string
}

type RevokeInviteResponse = void

export async function revokeInvite({
  org,
  inviteId,
}: RevokeInviteRequest): Promise<RevokeInviteResponse> {
  await api.delete(`organizations/${org}/invites/${inviteId}`)
}
