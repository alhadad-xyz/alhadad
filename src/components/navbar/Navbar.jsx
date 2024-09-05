import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Navbar = ({ toggleMenu, isMenuOpen }) => {
  const pathname = usePathname();

  const links = [
    {
      id: 1,
      title: "Home",
      url: "/",
    },
    {
      id: 2,
      title: "Services",
      url: "/services",
    },
    {
      id: 3,
      title: "Work",
      url: "/works",
    },
    {
      id: 4,
      title: "Blog",
      url: "/blogs",
    },
    {
      id: 5,
      title: "About",
      url: "/about",
    },
    {
      id: 6,
      title: "Contact",
      url: "/contact",
    },
  ];

  return (
    <nav
      id="colorlib-main-nav"
      role="navigation"
      className={isMenuOpen ? "open" : ""}
    >
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
      <div
        className={`js-fullheight colorlib-table ${isMenuOpen ? "open" : ""}`}
      >
        <div className="colorlib-table-cell js-fullheight">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="search"
                  placeholder="Enter any key to search..."
                />
                <button type="submit" className="btn btn-primary">
                  <i className="icon-search3"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <ul>
                {links.map((link) => (
                  <li key={link.id} className={pathname === link.url ? 'active' : ''}>
                    <Link href={link.url}>{link.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <h2 className="head-title">Works</h2>
              <a
                href="images/work-1.jpg"
                className="gallery image-popup-link text-center"
                style={{ backgroundImage: "url(images/work-1.jpg)" }}
              >
                <span>
                  <i className="icon-search3"></i>
                </span>
              </a>
              <a
                href="images/work-2.jpg"
                className="gallery image-popup-link text-center"
                style={{ backgroundImage: "url(images/work-2.jpg)" }}
              >
                <span>
                  <i className="icon-search3"></i>
                </span>
              </a>
              <a
                href="images/work-3.jpg"
                className="gallery image-popup-link text-center"
                style={{ backgroundImage: "url(images/work-3.jpg)" }}
              >
                <span>
                  <i className="icon-search3"></i>
                </span>
              </a>
              <a
                href="images/work-4.jpg"
                className="gallery image-popup-link text-center"
                style={{ backgroundImage: "url(images/work-4.jpg)" }}
              >
                <span>
                  <i className="icon-search3"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
