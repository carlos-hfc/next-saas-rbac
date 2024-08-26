import { organizationSchema } from "@saas/auth"
import { ArrowLeftRightIcon, CrownIcon, UserMinus } from "lucide-react"
import Image from "next/image"

import { ability, getCurrentOrg } from "@/auth/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { getMembers } from "@/http/get-members"
import { getMembership } from "@/http/get-membership"
import { getOrganization } from "@/http/get-organization"

import { removeMemberAction } from "./actions"

export async function MemberList() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()

  const [{ membership }, { members }, { organization }] = await Promise.all([
    getMembership(currentOrg!),
    getMembers(currentOrg!),
    getOrganization(currentOrg!),
  ])

  const authOrganization = organizationSchema.parse(organization)

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Members</h2>

      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map(member => (
              <TableRow key={member.id}>
                <TableCell className="w-12 py-2.5">
                  <Avatar>
                    <AvatarFallback />
                    {member.avatarUrl && (
                      <Image
                        src={member.avatarUrl}
                        alt=""
                        width={32}
                        height={32}
                        className="aspect-square size-full"
                      />
                    )}
                  </Avatar>
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="flex flex-col">
                    <span className="inline-flex items-center gap-2 font-medium">
                      {member.name}{" "}
                      {member.userId === membership.userId && "(me)"}
                      {organization.ownerId === member.userId && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <CrownIcon className="size-3" />
                          Owner
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {member.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    {permissions?.can(
                      "transfer_ownership",
                      authOrganization
                    ) && (
                      <Button
                        size="sm"
                        variant="ghost"
                      >
                        <ArrowLeftRightIcon className="mr-2 size-4" />
                        Transfer ownership
                      </Button>
                    )}

                    {permissions?.can("delete", "User") && (
                      <form action={removeMemberAction.bind(null, member.id)}>
                        <Button
                          disabled={
                            member.userId === membership.userId ||
                            member.userId === organization.ownerId
                          }
                          size="sm"
                          variant="destructive"
                        >
                          <UserMinus className="mr-2 size-4" />
                          Remove
                        </Button>
                      </form>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
