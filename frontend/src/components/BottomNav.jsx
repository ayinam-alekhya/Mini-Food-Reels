
import { Link, useLocation } from "react-router-dom";
import "../styles/bottom-nav.css";

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed-bottom-nav" role="navigation" aria-label="Main">
      <Link
        to="/"
        className={`bn-item ${pathname === "/" ? "active" : ""}`}
        aria-label="Home"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 9l9-6 9 6v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9z"/>
        </svg>
        <span>Home</span>
      </Link>

      <Link
        to="/saved"
        className={`bn-item ${pathname.startsWith("/saved") ? "active" : ""}`}
        aria-label="Saved"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 2h12v18l-6-4-6 4V2z"/>
        </svg>
        <span>Saved</span>
      </Link>
    </nav>
  );
}
