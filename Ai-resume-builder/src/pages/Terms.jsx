import { Link } from "react-router-dom";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";

const Terms = () => {
  const updated = "July 24, 2026";

  return (
    <div className="app-page flex min-h-screen flex-col">
      <Header />
      <main className="app-shell flex-1 py-8 sm:py-10">
        <article className="mx-auto max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
            Legal
          </p>
          <h1 className="app-title text-3xl sm:text-4xl">Terms and Conditions</h1>
          <p className="app-subtitle mt-2 text-sm">Last updated: {updated}</p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--app-ink)] sm:text-[15px]">
            <section>
              <h2 className="app-title mb-2 text-xl">1. Agreement</h2>
              <p className="text-[var(--app-muted)]">
                By accessing or using AI Resume Builder (“Service”), you agree to
                these Terms and Conditions. If you do not agree, do not use the
                Service.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">2. The Service</h2>
              <p className="text-[var(--app-muted)]">
                AI Resume Builder lets you create, edit, preview, download, and
                share resumes. Some features use AI-assisted writing. Manual
                resume creation is unlimited; AI-assisted resumes are limited as
                described in the product (currently up to 5 AI-enabled resumes
                per account unless we change the limit).
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">3. Accounts</h2>
              <p className="text-[var(--app-muted)]">
                You must sign in through our authentication provider (Clerk) to
                use account features. You are responsible for keeping your
                account secure and for all activity under your account. Provide
                accurate information and do not share your login with others.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">4. Your content</h2>
              <p className="text-[var(--app-muted)]">
                You retain ownership of the resume content you create (text,
                links, and files you upload). You grant us a limited license to
                store, process, and display that content only to operate the
                Service (including AI generation you request, previews, PDF
                download, and share links you enable). You are responsible for
                the accuracy and legality of your content and for having rights
                to any materials you upload.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">5. AI features</h2>
              <p className="text-[var(--app-muted)]">
                AI suggestions may be incomplete, inaccurate, or unsuitable for
                your situation. You must review and edit all AI-generated text
                before using it. We do not guarantee interview outcomes, job
                offers, or that AI output will pass any ATS or employer review.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">6. Sharing and public links</h2>
              <p className="text-[var(--app-muted)]">
                If you share a resume link, anyone with that link may view the
                shared resume. You can rotate or stop sharing as provided in the
                product. Do not share links you do not want others to open.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">7. Acceptable use</h2>
              <p className="mb-2 text-[var(--app-muted)]">You agree not to:</p>
              <ul className="list-disc space-y-1 pl-5 text-[var(--app-muted)]">
                <li>Use the Service for unlawful, harmful, or fraudulent purposes</li>
                <li>Upload malware or attempt to disrupt or reverse-engineer the Service</li>
                <li>Abuse AI or API limits, scrape, or overload our systems</li>
                <li>Impersonate others or misrepresent your identity or credentials</li>
              </ul>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">8. Availability and changes</h2>
              <p className="text-[var(--app-muted)]">
                We may update, suspend, or discontinue features at any time. We
                may change these Terms by posting an updated version on this
                page. Continued use after changes means you accept the updated
                Terms.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">9. Disclaimer</h2>
              <p className="text-[var(--app-muted)]">
                The Service is provided “as is” and “as available” without
                warranties of any kind, express or implied, including fitness for
                a particular purpose and non-infringement. We do not warrant
                uninterrupted or error-free operation.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">10. Limitation of liability</h2>
              <p className="text-[var(--app-muted)]">
                To the fullest extent permitted by law, AI Resume Builder and its
                operators are not liable for any indirect, incidental, special,
                consequential, or lost-profit damages, or for loss of data,
                arising from your use of the Service. Our total liability for any
                claim related to the Service is limited to the amount you paid us
                (if any) in the 12 months before the claim, or zero if the
                Service is free.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">11. Termination</h2>
              <p className="text-[var(--app-muted)]">
                We may suspend or terminate access if you violate these Terms or
                misuse the Service. You may stop using the Service at any time.
                Provisions that should survive (including ownership, disclaimer,
                and liability limits) will survive termination.
              </p>
            </section>

            <section>
              <h2 className="app-title mb-2 text-xl">12. Contact</h2>
              <p className="text-[var(--app-muted)]">
                Questions about these Terms can be sent through the contact
                method listed on the Service or via your account support channel
                once published.
              </p>
            </section>
          </div>

          <p className="mt-10 text-sm text-[var(--app-muted)]">
            <Link to="/" className="font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-300">
              ← Back to home
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
