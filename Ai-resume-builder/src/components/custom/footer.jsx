const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      id="no-print"
      className="app-site-footer mt-auto border-t border-[var(--app-border)] bg-[var(--app-surface)]"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-5 sm:px-6 sm:py-6">
        <p className="text-center text-xs text-[var(--app-muted)] sm:text-sm">
          © {year} AI Resume Builder. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
