import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { UserButton, useUser } from "@clerk/clerk-react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <header
      className="app-site-header sticky top-0 z-40 flex items-center justify-between gap-2 border-b px-3 py-2.5 shadow-sm backdrop-blur-md sm:gap-3 sm:px-5 sm:py-3"
      style={{ fontFamily: '"DM Sans", sans-serif' }}
    >
      <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3 cursor-pointer">
        <img
          src="/logo.svg"
          alt="AI Resume Builder Logo"
          className="h-9 w-9 shrink-0 sm:h-11 sm:w-11"
          height={44}
          width={44}
        />
        <div className="min-w-0">
          <p
            className="truncate text-sm font-semibold leading-none text-[var(--app-ink)]"
            style={{ fontFamily: '"Fraunces", serif' }}
          >
            AI Resume Builder
          </p>
          <p className="mt-1 hidden text-[11px] text-[var(--app-muted)] sm:block">
            Craft. Polish. Apply.
          </p>
        </div>
      </Link>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <ThemeToggle />
        {isSignedIn ? (
          <>
            <Link to="/dashboard">
              <Button
                size="sm"
                className="app-btn-dark cursor-pointer px-3 sm:px-4"
              >
                Dashboard
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <Link to="/auth/sign-in" className="shrink-0">
            <Button
              size="sm"
              className="app-btn-accent cursor-pointer px-3 sm:px-4"
            >
              Get Started
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
