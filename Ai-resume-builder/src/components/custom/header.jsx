import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { UserButton, useUser } from "@clerk/clerk-react";

const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/80 bg-white/85 px-5 py-3 shadow-sm backdrop-blur-md mb-0"
      style={{ fontFamily: '"DM Sans", sans-serif' }}
    >
      <Link to="/" className="flex items-center gap-3 cursor-pointer">
        <img src="/logo.svg" alt="AI Resume Builder Logo" height={48} width={48} />
        <div className="hidden sm:block">
          <p
            className="text-sm font-semibold text-slate-900 leading-none"
            style={{ fontFamily: '"Fraunces", serif' }}
          >
            AI Resume Builder
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Craft. Polish. Apply.</p>
        </div>
      </Link>

      {isSignedIn ? (
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button className="bg-slate-900 text-white hover:bg-slate-800 cursor-pointer">
              Dashboard
            </Button>
          </Link>
          <UserButton />
        </div>
      ) : (
        <Link to="/auth/sign-in">
          <Button className="cursor-pointer bg-teal-600 text-white hover:bg-teal-700">
            Get Started
          </Button>
        </Link>
      )}
    </div>
  );
};

export default Header;
