import { Link } from "react-router-dom";
import Header from "@/components/custom/header";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="app-page min-h-screen">
    <Header />
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">404</p>
      <h1 className="app-title text-3xl">Page not found</h1>
      <p className="app-subtitle max-w-md text-sm">
        This URL doesn’t exist. Head home or open your dashboard.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link to="/">
          <Button className="app-btn-dark cursor-pointer">Home</Button>
        </Link>
        <Link to="/dashboard">
          <Button className="app-btn-accent cursor-pointer">Dashboard</Button>
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
