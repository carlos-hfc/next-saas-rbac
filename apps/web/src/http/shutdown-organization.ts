import { api } from "./api-client"

interface ShutdownOrganizationRequest {
  org: string
}

type ShutdownOrganizationResponse = void

export async function shutdownOrganization({
  org,
}: ShutdownOrganizationRequest): Promise<ShutdownOrganizationResponse> {
  await api.delete(`organizations/${org}`)
}
