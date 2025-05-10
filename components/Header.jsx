import Link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = ''; // Enable scrolling
    }

    return () => {
      document.body.style.overflow = ''; // Cleanup on unmount
    };
  }, [isMobileMenuOpen]);

  const handleRouteChange = () => {
    setIsMobileMenuOpen(false); // Close the mobile menu when a link is clicked
    window.location.href = '/';
  };

  return (
    <header
      className={`absolute w-full text-white px-4 py-3 ${
        isMobileMenuOpen ? 'bg-[#3e5074]' : ''
      } transition-all duration-300`}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Left: Icon */}
        <div className="flex items-center">
          <Link href="/" onClick={() => handleRouteChange()}>
            <img
              src="/regnovaai-logo.png"
              alt="RegnovaAI Logo"
              className="mx-auto"
              width="120"
              height="120"
            />
          </Link>
        </div>

        {/* Right: Links */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" onClick={() => handleRouteChange()} className="hover:text-blue-300 text-lg">
            Home
          </Link>
          <Link href="/aboutus" className="hover:text-blue-300 text-lg">
            About us
          </Link>
          <Link href="/mission" className="hover:text-blue-300 text-lg">
            Mission
          </Link>
          <Link href="/vision" className="hover:text-blue-300 text-lg">
            Vision
          </Link>
          <Link href="/career" className="hover:text-blue-300 text-lg">
            Career
          </Link>
          <Link href="/plans" className="hover:text-blue-300 text-lg">
            Pricing
          </Link>
          <Link href="/login" className="hover:text-blue-300 text-lg">
            Log in
          </Link>
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
        <nav className="md:hidden flex flex-col p-6 space-y-4 text-center bg-[#3e5074] text-white transition-transform duration-300 fixed top-0 left-0 right-0 bottom-0 z-50 transform translate-y-0">
          {/* Close Button */}
          <button
            className="self-end text-white focus:outline-none mb-4"
            aria-label="Close Menu"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Links */}
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-300 text-xl font-medium">
            Home
          </Link>
          <Link href="/aboutus" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-300 text-xl font-medium">
            About us
          </Link>
          <Link href="/mission" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-300 text-xl font-medium">
            Mission
          </Link>
          <Link href="/vision" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-300 text-xl font-medium">
            Vision
          </Link>
          <Link href="/career" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-300 text-xl font-medium">
            Career
          </Link>
          <Link href="/plans" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-300 text-xl font-medium">
            Pricing
          </Link>
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-300 text-xl font-medium">
            Log in
          </Link>
        </nav>
      )}
    </header>
  );
}