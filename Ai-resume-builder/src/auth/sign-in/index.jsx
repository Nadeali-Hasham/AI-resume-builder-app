import { SignIn } from "@clerk/clerk-react"
import Header from "@/components/custom/header"
import Footer from "@/components/custom/footer"
import Seo from "@/components/Seo"
import { PAGE_SEO } from "@/lib/seo"

const SignInPage = () => {
  return (
    <div className="app-auth-page flex min-h-screen flex-col">
      <Seo {...PAGE_SEO.signIn} />
      <div className="w-full absolute top-0 left-0 z-10">
        <Header />
      </div>
      <div className="mt-16 flex flex-1 items-center justify-center px-4">
        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]/90 p-2 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)]">
          <SignIn
            forceRedirectUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
            signUpForceRedirectUrl="/dashboard"
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SignInPage
