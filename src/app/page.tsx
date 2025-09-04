
"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { data: session } = useSession()

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <h1 className="text-2xl font-bold">NovaTok Explorer ✨</h1>
        {session ? (
          <>
            <p>Welcome, {session.user?.name}</p>
            <Button onClick={() => signOut()}>Logout</Button>
          </>
        ) : (
          <Button onClick={() => signIn("github")}>Login with GitHub</Button>
        )}
      </motion.div>
    )
}
