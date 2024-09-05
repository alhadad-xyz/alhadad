"use client";

import "./globals.css";
import "./animate.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { useState } from "react";

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (event) => {
    event.preventDefault();
    setIsMenuOpen((prevState) => !prevState);
    const body = document.querySelector("body");
    const navToggle = document.querySelector(
      "#colorlib-main-nav > .js-colorlib-nav-toggle"
    );

    if (isMenuOpen) {
      body.classList.remove("menu-show");
      if (navToggle) navToggle.classList.remove("show");
    } else {
      body.classList.add("menu-show");
      if (navToggle) {
        setTimeout(() => {
          navToggle.classList.add("show");
        }, 900);
      }
    }
  };

  return (
    <html lang="en">
      <body>
        <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <div id="colorlib-page">
          <Header toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
          {children}
          <Footer />
        </div>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
      </body>
    </html>
  );
}
