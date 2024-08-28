import { api } from "./api-client"

type RejectInviteResponse = void

export async function rejectInvite(
  inviteId: string
): Promise<RejectInviteResponse> {
  await api.delete(`invites/${inviteId}/reject`)
}
