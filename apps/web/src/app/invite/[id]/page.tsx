import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { CheckCircleIcon, LogInIcon, LogOutIcon } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import { auth, isAuthenticated } from "@/auth/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { acceptInvite } from "@/http/accept-invite"
import { getInvite } from "@/http/get-invite"

dayjs.extend(relativeTime)

interface InvitePageProps {
  params: {
    id: string
  }
}

export default async function InvitePage({ params }: InvitePageProps) {
  const inviteId = params.id

  const { invite } = await getInvite(inviteId)
  const isUserAuthenticated = isAuthenticated()

  let currentUserEmail = null

  if (isUserAuthenticated) {
    const { user } = await auth()

    currentUserEmail = user.email
  }

  const userIsAuthenticatedWithSameEmailFromInvite =
    currentUserEmail === invite.email

  async function signInFromInvite() {
    "use server"

    cookies().set("inviteId", inviteId)

    redirect(`/auth/sign-in?email=${invite.email}`)
  }

  async function acceptInviteAction() {
    "use server"

    await acceptInvite(inviteId)

    redirect("/")
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {invite?.author?.avatarUrl && (
              <AvatarImage src={invite.author.avatarUrl} />
            )}
            <AvatarFallback />
          </Avatar>

          <p className="text-balance text-center leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              {invite?.author?.name ?? "Someone"}
            </span>{" "}
            invited you to join{" "}
            <span className="font-medium text-foreground">
              {invite.organization.name}
            </span>
            .{" "}
            <span className="text-xs">{dayjs(invite.createdAt).fromNow()}</span>
          </p>
        </div>

        <Separator />

        {!isUserAuthenticated && (
          <form action={signInFromInvite}>
            <Button
              variant="secondary"
              className="w-full"
            >
              <LogInIcon className="mr-2 size-4" />
              Sign in to accep the invite
            </Button>
          </form>
        )}

        {userIsAuthenticatedWithSameEmailFromInvite && (
          <form action={acceptInviteAction}>
            <Button
              variant="secondary"
              className="w-full"
            >
              <CheckCircleIcon className="mr-2 size-4" />
              Join {invite.organization.name}
            </Button>
          </form>
        )}

        {isUserAuthenticated && !userIsAuthenticatedWithSameEmailFromInvite && (
          <div className="space-y-4">
            <p className="text-balance text-center leading-relaxed text-muted-foreground">
              This invite was sent to{" "}
              <span className="font-medium text-foreground">
                {invite.email}
              </span>{" "}
              but you are currenctly authenticated as{" "}
              <span className="font-medium text-foreground">
                {currentUserEmail}
              </span>
            </p>

            <div className="space-y-2">
              <Button
                asChild
                variant="secondary"
                className="w-full"
              >
                <a href="/api/auth/sign-out">
                  <LogOutIcon className="mr-2 size-4" />
                  Sign out from {currentUserEmail}
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <Link href="/">Back to dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
