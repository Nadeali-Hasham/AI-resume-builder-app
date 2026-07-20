'use client'
import { SignIn } from "@clerk/clerk-react"
import Header from "@/components/custom/header"

const SignInPage = () => {
  return (
    <div className="app-auth-page flex-col">
      <div className="w-full absolute top-0 left-0">
        <Header />
      </div>
      <div className="mt-16 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)]">
        <SignIn />
      </div>
    </div>
  )
}

export default SignInPage
