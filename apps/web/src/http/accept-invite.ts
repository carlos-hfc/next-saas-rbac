import { api } from "./api-client"

type AcceptInviteResponse = void

export async function acceptInvite(
  inviteId: string
): Promise<AcceptInviteResponse> {
  await api.post(`invites/${inviteId}/accept`)
}
