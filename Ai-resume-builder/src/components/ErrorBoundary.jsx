import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-page flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="app-title text-2xl">Something went wrong</h1>
          <p className="app-subtitle max-w-md text-sm">
            Refresh the page or go back to the dashboard. If it keeps happening, try
            signing out and in again.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white cursor-pointer"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
            <Link
              to="/dashboard"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800"
              onClick={() => this.setState({ hasError: false })}
            >
              Dashboard
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
