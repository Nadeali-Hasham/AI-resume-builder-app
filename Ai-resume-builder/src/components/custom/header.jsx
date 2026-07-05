import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { UserButton, useUser } from "@clerk/clerk-react";

const Header = () => {

    const { isSignedIn } = useUser();
  return (
    <div className="p-3 px-5 justify-between flex items-center border-b border-b-slate-300 mb-6 shadow-md">
      <img src="/logo.svg" alt="AI Resume Builder Logo" height={64} width={64} />
      {
        isSignedIn ? (
          <div className="flex items-center gap-4">
            <Link to={'/dashboard'} className="font-bold text-lg">
              <Button className="bg-blue-500 text-white cursor-pointer">Dashboard</Button>
            </Link>
          <UserButton />
          </div>
        ) : (
          <Link to={'/auth/sign-in'} className="font-bold text-lg">
            <Button>Get Started</Button>
          </Link>
        )
      }
      
    </div>
  )
}

export default Header
