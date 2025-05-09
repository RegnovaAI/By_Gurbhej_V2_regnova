import Link from 'next/link';
import React, { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleRouteChange = () => {
    window.location.href = '/' // Close the mobile menu when a link is clicked
  }

  return (
    <header className="absolute  w-full text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Icon */}
        <div className="flex items-center">
        <Link href="/" onClick={() => handleRouteChange()}>
        <img
          src="/regnovaai-logo.png"
          alt="RegnovaAI Logo"
          className="mx-auto"
          width="80"
          height="80"
        />
        </Link>
        </div>

        {/* Right: Links */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" onClick={() => handleRouteChange()} className="hover:text-blue-300">Home</Link>
          <Link href="/aboutus" className="hover:text-blue-300">About us</Link>
          <Link href="/mission" className="hover:text-blue-300">Mission</Link>
          <Link href="/vision" className="hover:text-blue-300">Vision</Link>
          <Link href="/career" className="hover:text-blue-300">Career</Link>
          <Link href="/plans" className="hover:text-blue-300">Pricing</Link>
          <Link href="/login" className="hover:text-blue-300">Log in</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle Menu"
          onClick={toggleMobileMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Links */}
      {isMobileMenuOpen && (
        <nav className="md:hidden mt-3 space-y-2 text-center bg-[#3e5074]">
          <Link href="/" className="hover:text-blue-300">Home</Link>
          <Link href="/features" className="hover:text-blue-300">About us</Link>
          <Link href="/features" className="hover:text-blue-300">Mission</Link>
          <Link href="/features" className="hover:text-blue-300">Vision</Link>
          <Link href="/features" className="hover:text-blue-300">Career</Link>
          <Link href="/plans" className="hover:text-blue-300">Pricing</Link>
          <Link href="/login" className="hover:text-blue-300">Log in</Link>
        </nav>
      )}
    </header>
  );
}