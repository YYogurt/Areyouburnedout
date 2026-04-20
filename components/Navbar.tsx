"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar" id="main-navbar">
      <Link href="/" className="navbar-brand">
        <span className="navbar-brand-icon">✨</span>
        <span className="navbar-brand-text">Star Vent</span>
      </Link>

      <div className="navbar-nav">
        <Link
          href="/"
          className={`nav-link ${pathname === "/" ? "active" : ""}`}
          id="nav-dashboard"
        >
          <span>🌌</span>
          <span className="nav-link-text">Sky</span>
        </Link>
        <Link
          href="/write"
          className="nav-link nav-link-cta"
          id="nav-write"
        >
          <span>✍️</span>
          <span className="nav-link-text">Vent</span>
        </Link>
      </div>
    </nav>
  );
}
