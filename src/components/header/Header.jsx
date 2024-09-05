import Link from "next/link";
import React from "react";

const Header = ({ toggleMenu, isMenuOpen }) => {
  return (
    <header>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="colorlib-navbar-brand">
              <Link href="/" className="colorlib-logo">
                  <span>Alhadad.</span>
              </Link>
            </div>
            <a
              href="#"
              onClick={toggleMenu}
              className={`js-colorlib-nav-toggle colorlib-nav-toggle ${
                isMenuOpen ? "active" : ""
              }`}
              aria-label="Toggle navigation"
            >
              <i></i>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
