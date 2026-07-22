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
          <h2 className="home-next__title">How it works</h2>
          <p className="home-next__text">
            Three focused steps — no clutter, just a resume you can send today.
          </p>
          <ol className="home-steps">
            <li>
              <strong>Fill your story</strong>
              <span>Personal details, experience, education, projects, and skills.</span>
            </li>
            <li>
              <strong>Refine with AI</strong>
              <span>Paste a job description and pick from tailored summary or bullet options.</span>
            </li>
            <li>
              <strong>Download & share</strong>
              <span>Export a real PDF or send a private share link with one click.</span>
            </li>
          </ol>
        </div>
      </section>

      <section className="home-templates">
        <div className="home-templates__inner">
          <h2 className="home-next__title">Layouts that fit the role</h2>
          <p className="home-next__text">
            Switch between Classic, Modern, and ATS-friendly templates without rebuilding.
          </p>
          <div className="home-templates__grid">
            <article className="home-tpl">
              <div className="home-tpl__preview home-tpl__preview--classic" />
              <h3>Classic</h3>
              <p>Centered and polished for most applications.</p>
            </article>
            <article className="home-tpl">
              <div className="home-tpl__preview home-tpl__preview--modern" />
              <h3>Modern</h3>
              <p>Sidebar accent for a sharper product look.</p>
            </article>
            <article className="home-tpl">
              <div className="home-tpl__preview home-tpl__preview--ats" />
              <h3>ATS</h3>
              <p>Plain structure that parses cleanly in applicant systems.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage
