
"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { data: session } = useSession()

  return (
    <main className="flex flex-col items-center justify-center gap-6 p-6">
      {session ? (
        <>
          <p>Welcome, {session.user?.name}</p>
          <Button onClick={() => signOut()}>Logout</Button>
        </>
      ) : (
        <Button onClick={() => signIn("github")}>Login with GitHub</Button>
      )}
    </main>
  )
}
