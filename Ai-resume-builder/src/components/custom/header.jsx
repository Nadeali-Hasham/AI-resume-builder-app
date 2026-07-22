import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { UserButton, useUser } from "@clerk/clerk-react";

const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-3 py-2.5 shadow-sm backdrop-blur-md sm:px-5 sm:py-3"
      style={{ fontFamily: '"DM Sans", sans-serif' }}
    >
      <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3 cursor-pointer">
        <img
          src="/logo.svg"
          alt="AI Resume Builder Logo"
          className="h-9 w-9 shrink-0 sm:h-12 sm:w-12"
          height={48}
          width={48}
        />
        <div className="min-w-0 max-w-[42vw] xs:max-w-none">
          <p
            className="truncate text-sm font-semibold text-slate-900 leading-none"
            style={{ fontFamily: '"Fraunces", serif' }}
          >
            AI Resume Builder
          </p>
          <p className="mt-1 hidden text-[11px] text-slate-500 sm:block">
            Craft. Polish. Apply.
          </p>
        </div>
      </Link>

      {isSignedIn ? (
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link to="/dashboard">
            <Button
              size="sm"
              className="bg-slate-900 text-white hover:bg-slate-800 cursor-pointer px-3 sm:px-4"
            >
              <span className="sm:hidden">Dash</span>
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <Link to="/auth/sign-in" className="shrink-0">
          <Button
            size="sm"
            className="cursor-pointer bg-teal-600 text-white hover:bg-teal-700 px-3 sm:px-4"
          >
            <span className="sm:hidden">Start</span>
            <span className="hidden sm:inline">Get Started</span>
          </Button>
        </Link>
      )}
    </header>
  );
};

export default Header;
