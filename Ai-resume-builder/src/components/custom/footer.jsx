import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      id="no-print"
      className="app-site-footer mt-auto border-t border-[var(--app-border)] bg-[var(--app-surface)]"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-2 px-4 py-5 text-center sm:px-6 sm:py-6">
        <p className="text-xs text-[var(--app-muted)] sm:text-sm">
          © {year} AI Resume Builder. All rights reserved.
        </p>
        <p className="text-xs text-[var(--app-muted)] sm:text-sm">
          Built by{" "}
          <span className="font-medium text-[var(--app-ink)]">
            Nade Ali Hasham
          </span>
        </p>
        <Link
          to="/terms"
          className="text-xs font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-300 sm:text-sm"
        >
          Terms and Conditions
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
