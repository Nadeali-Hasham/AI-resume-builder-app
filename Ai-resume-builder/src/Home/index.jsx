'use client'

import { Link } from "react-router-dom"
import Header from "@/components/custom/header"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/clerk-react"
import { ArrowRight } from "lucide-react"
import "./home.css"

const Homepage = () => {
  const { isSignedIn } = useUser()
  const primaryPath = isSignedIn ? "/dashboard" : "/auth/sign-in"

  return (
    <div className="home-page">
      <Header />

      <section className="home-hero">
        <div className="home-hero__atmosphere" aria-hidden="true" />

        <div className="home-hero__content">
          <p className="home-hero__brand">AI Resume Builder</p>

          <h1 className="home-hero__headline">
            Write a resume that gets you the interview.
          </h1>

          <p className="home-hero__support">
            Build a clean, professional resume with AI-assisted writing and live
            preview — ready to download and share in minutes.
          </p>

          <div className="home-hero__cta">
            <Link to={primaryPath}>
              <Button className="home-hero__btn-primary cursor-pointer">
                {isSignedIn ? "Go to Dashboard" : "Start Building"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {isSignedIn && (
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  className="home-hero__btn-secondary cursor-pointer"
                >
                  My Resumes
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="home-hero__visual" aria-hidden="true">
          <div className="home-resume-sheet home-resume-sheet--main">
            <div className="home-resume-sheet__accent" />
            <div className="home-resume-sheet__name">Alex Morgan</div>
            <div className="home-resume-sheet__role">Product Engineer</div>
            <div className="home-resume-sheet__meta">
              <span>alex@email.com</span>
              <span>San Francisco, CA</span>
            </div>
            <div className="home-resume-sheet__divider" />
            <div className="home-resume-sheet__section">Summary</div>
            <div className="home-resume-sheet__lines">
              <span />
              <span />
              <span className="short" />
            </div>
            <div className="home-resume-sheet__section">Experience</div>
            <div className="home-resume-sheet__job">
              <strong>Senior Developer</strong>
              <em>Northwind Labs</em>
            </div>
            <div className="home-resume-sheet__lines">
              <span />
              <span className="mid" />
            </div>
            <div className="home-resume-sheet__section">Skills</div>
            <div className="home-resume-sheet__skills">
              <i style={{ width: "78%" }} />
              <i style={{ width: "64%" }} />
              <i style={{ width: "86%" }} />
            </div>
          </div>

          <div className="home-resume-sheet home-resume-sheet--back">
            <div className="home-resume-sheet__accent" />
            <div className="home-resume-sheet__name faint">Jordan Lee</div>
            <div className="home-resume-sheet__lines faint-lines">
              <span />
              <span />
              <span className="short" />
              <span />
              <span className="mid" />
            </div>
          </div>
        </div>
      </section>

      <section className="home-next">
        <div className="home-next__inner">
          <h2 className="home-next__title">From blank page to polished PDF</h2>
          <p className="home-next__text">
            Add your details, refine with AI, customize the theme, then download
            or share — all in one focused workspace.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Homepage
