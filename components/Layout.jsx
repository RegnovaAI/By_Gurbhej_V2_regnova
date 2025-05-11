import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Layout = ({ children }) => {
  const router = useRouter();

  // Define pages where the sidebar should be visible
  const pagesWithSidebar = ["/profile"];

  const showSidebar = pagesWithSidebar.includes(router.pathname);

  return (
    <div
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="mb-10 flex mx-auto">
        {showSidebar && (
          <aside style={{ width: "250px", padding: "1rem" }}>
            <nav>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
              </ul>
            </nav>
          </aside>
        )}
        <main style={{ flex: 1, padding: "1rem" }}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
