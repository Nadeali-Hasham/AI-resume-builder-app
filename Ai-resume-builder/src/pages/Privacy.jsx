import { Link } from "react-router-dom";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import Seo from "@/components/Seo";
import { PAGE_SEO } from "@/lib/seo";

const Privacy = () => {
  const updated = "July 13, 2026";

  return (
    <div className="app-page flex min-h-screen flex-col">
      <Seo {...PAGE_SEO.privacy} />
      <Header />
      <main className="app-shell flex-1 py-8 sm:py-10">
        <article className="mx-auto max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
            Legal
          </p>
          <h1 className="app-title text-3xl sm:text-4xl">Privacy Policy</h1>
          <p className="app-subtitle mt-2 text-sm">Last updated: {updated}</p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--app-ink)] sm:text-[15px]">
            <section>
              <h2 className="app-title mb-2 text-xl">1. Overview</h2>
              <p className="text-[var(--app-muted)]">
                This Privacy Policy explains how AI Resume Builder (“Service”,
                “we”, “us”) collects, uses, and shares information when you use
                our website and related features. By using the Service, you
                agree to this policy.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">2. Information we collect</h2>
              <p className="mb-2 text-[var(--app-muted)]">We may collect:</p>
              <ul className="list-disc space-y-1 pl-5 text-[var(--app-muted)]">
                <li>
                  <span className="font-medium text-[var(--app-ink)]">Account data</span>{" "}
                  — identity and contact details from our authentication
                  provider (Clerk), such as your user ID, name, and email
                </li>
                <li>
                  <span className="font-medium text-[var(--app-ink)]">Resume content</span>{" "}
                  — text, links, certifications, project details, and files you
                  upload (for example certificate images or PDFs)
                </li>
                <li>
                  <span className="font-medium text-[var(--app-ink)]">Usage data</span>{" "}
                  — basic technical logs needed to operate and secure the
                  Service (for example request timing, errors, and rate-limit
                  counters)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">3. How we use information</h2>
              <p className="mb-2 text-[var(--app-muted)]">We use information to:</p>
              <ul className="list-disc space-y-1 pl-5 text-[var(--app-muted)]">
                <li>Provide accounts, resume editing, preview, PDF download, and sharing</li>
                <li>Run AI-assisted writing when you request it</li>
                <li>Enforce plan limits, prevent abuse, and keep the Service secure</li>
                <li>Improve reliability and fix bugs</li>
              </ul>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">4. AI processing</h2>
              <p className="text-[var(--app-muted)]">
                When you use AI features, relevant resume text you provide may be
                sent to our AI provider (currently Google Gemini) to generate
                suggestions. Do not include secrets or sensitive data you do not
                want processed by third-party AI services. Review all AI output
                before you use it.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">5. Sharing and public links</h2>
              <p className="text-[var(--app-muted)]">
                If you create a share link, anyone with that link can view the
                shared resume (and related public assets such as certificate
                images you included). We do not sell your personal information.
                We may share data with infrastructure providers that help us
                run the Service (hosting, authentication, AI), only as needed to
                operate it.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">6. Cookies and similar tech</h2>
              <p className="text-[var(--app-muted)]">
                Authentication and session management are handled by Clerk and
                may use cookies or similar technologies. We may also store
                preferences such as theme (light/dark) in your browser’s local
                storage.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">7. Retention</h2>
              <p className="text-[var(--app-muted)]">
                We keep account and resume data while your account is active and
                as needed to provide the Service. You may delete resumes in the
                product. If you want account deletion help, contact us through
                the channel listed on the Service once published.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">8. Security</h2>
              <p className="text-[var(--app-muted)]">
                We use reasonable technical measures (including authentication
                and access controls) to protect data. No method of transmission
                or storage is 100% secure; use strong account practices and
                share links carefully.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">9. Children’s privacy</h2>
              <p className="text-[var(--app-muted)]">
                The Service is not directed to children under 13 (or the minimum
                age required in your region). We do not knowingly collect
                personal information from children.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">10. Changes</h2>
              <p className="text-[var(--app-muted)]">
                We may update this Privacy Policy by posting a new version on
                this page. Continued use after changes means you accept the
                updated policy.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">11. Contact</h2>
              <p className="text-[var(--app-muted)]">
                Privacy questions can be sent through the contact method listed
                on the Service or via your account support channel once
                published. See also our{" "}
                <Link
                  to="/terms"
                  className="font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-300"
                >
                  Terms and Conditions
                </Link>
                .
              </p>
            </section>
          </div>

          <p className="mt-10 text-sm text-[var(--app-muted)]">
            <Link
              to="/"
              className="font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-300"
            >
              ← Back to home
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
