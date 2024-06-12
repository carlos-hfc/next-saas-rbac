import Image from "next/image"
import Link from "next/link"

import githubIcon from "@/assets/github-icon.svg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SignUpPage() {
  return (
    <form className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input
          name="name"
          id="name"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input
          type="email"
          name="email"
          id="email"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password-confirmation">Confirm you password</Label>
        <Input
          type="password"
          name="password-confirmation"
          id="password-confirmation"
        />
      </div>

      <Button
        className="w-full"
        type="submit"
      >
        Create account
      </Button>

      <Button
        className="w-full"
        variant="link"
        size="sm"
        asChild
      >
        <Link href="/auth/sign-in">Already registered? Sign in</Link>
      </Button>

      <Separator />

      <Button
        className="w-full"
        variant="outline"
        type="button"
      >
        <Image
          src={githubIcon}
          className="mr-4 size-4 dark:invert"
          alt=""
        />
        Sign up with GitHub
      </Button>
    </form>
  )
}
