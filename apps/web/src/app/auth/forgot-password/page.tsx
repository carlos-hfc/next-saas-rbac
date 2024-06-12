import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  return (
    <form className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input
          type="email"
          name="email"
          id="email"
        />
      </div>

      <Button
        className="w-full"
        type="submit"
      >
        Recover password
      </Button>

      <Button
        className="w-full"
        variant="link"
        size="sm"
        asChild
      >
        <Link href="/auth/sign-up">Sign in instead</Link>
      </Button>
    </form>
  )
}
