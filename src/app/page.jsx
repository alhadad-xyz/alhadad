"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Waypoint } from "react-waypoint";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Link from "next/link";
import Image from "next/image";

const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
  ssr: false,
});

export default function Home() {
  const [animatedItems, setAnimatedItems] = useState([]);

  const handleWaypointEnter = (index) => {
    const delay = parseInt(index.split("-").pop(), 0) * 120;

    setTimeout(() => {
      setAnimatedItems((prev) => [...prev, index]);
    }, delay);
  };

  const carouselOptions1 = {
    animateOut: "fadeOut",
    animateIn: "fadeIn",
    autoplay: true,
    loop: true,
    margin: 0,
    nav: true,
    dots: false,
    autoHeightClass: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },
    navText: [
      "<i className='icon-arrow-left3 owl-direction'></i>",
      "<i className='icon-arrow-right3 owl-direction'></i>",
    ],
  };

  const carouselOptions3 = {
    animateOut: "fadeOut",
    animateIn: "fadeIn",
    autoplay: true,
    loop: true,
    margin: 0,
    nav: false,
    dots: false,
    autoHeightClass: true,
    items: 1,
    navText: [
      "<i className='icon-arrow-left3 owl-direction'></i>",
      "<i className='icon-arrow-right3 owl-direction'></i>",
    ],
  };

  const works = [
    {
      id: 1,
      title: "Foodie's",
      desc: "This POS application is designed for a food and beverage business, offering a sleek and intuitive interface for quick ordering and checkout.",
    },
    {
      id: 2,
      title: "ESTUDO",
      desc: "This portfolio website is designed for photographers and videographers, offering a sleek and intuitive interface to showcase their work.",
    },
    {
      id: 3,
      title: "Personal Website",
      desc: "Crafted to highlight my journey, skills, and achievements. With a modern and user-friendly design, it offers a comprehensive view of my work portfolio, showcasing my projects and expertise.",
    },
    {
      id: 4,
      title: "Akesushi",
      desc: "This restaurant website is designed to offer a complete dining experience online. Featuring an elegant profile section, it provides an overview of the restaurant's story, ambiance, and team. The catalogue showcases the full menu with detailed descriptions and high-quality images of dishes.",
    },
  ];

  return (
    <>
      <div id="colorlib-about">
        <div className="container">
          <div className="row text-center">
            <h2 className="bold">About</h2>
          </div>
          <div className="row">
            <Waypoint
              onEnter={() => handleWaypointEnter("about-0")}
              bottomOffset="15%"
            >
              <div
                className={`col-md-5 animate-box ${
                  animatedItems.includes("about-0") ? "fadeInUp animated" : ""
                }`}
              >
                <OwlCarousel className="owl-carousel3" {...carouselOptions3}>
                  <div className="item">
                    <Image
                      className="img-responsive about-img"
                      src="images/about.jpg"
                      alt="html5 bootstrap template by colorlib.com"
                    />
                  </div>
                  <div className="item">
                    <Image
                      className="img-responsive about-img"
                      src="images/about-2.jpg"
                      alt="html5 bootstrap template by colorlib.com"
                    />
                  </div>
                </OwlCarousel>
              </div>
            </Waypoint>
            <Waypoint
              onEnter={() => handleWaypointEnter("about-1")}
              bottomOffset="15%"
            >
              <div
                className={`col-md-6 col-md-push-1 animate-box ${
                  animatedItems.includes("about-1") ? "fadeInUp animated" : ""
                }`}
              >
                <div className="about-desc">
                  <OwlCarousel className="owl-carousel3" {...carouselOptions3}>
                    <div className="item">
                      <h2>
                        <span>Mohammad</span>
                        <span>Khalid I Al Hadad</span>
                      </h2>
                    </div>
                    <div className="item">
                      <h2>
                        <span>I&apos;m</span>
                        <span>A Web Developer</span>
                      </h2>
                    </div>
                  </OwlCarousel>
                  <div className="desc">
                    <div className="rotate">
                      <h2 className="heading">About</h2>
                    </div>
                    <p>
                      With over three years of experience crafting engaging web
                      applications, I have a genuine passion for exploring new
                      technologies and thrive on the challenge of learning and
                      adapting quickly. Known for my strong work ethic and knack
                      for solving complex problems, I bring enthusiasm and
                      creativity to every project, eagerly tackling obstacles
                      and delivering innovative solutions. My journey is driven
                      by curiosity and a relentless drive to grow and excel in
                      the ever-evolving tech landscape.
                    </p>
                    <p className="colorlib-social-icons">
                      <a href="#">
                        <i className="icon-facebook4"></i>
                      </a>
                      <a href="#">
                        <i className="icon-twitter3"></i>
                      </a>
                      <a href="#">
                        <i className="icon-googleplus"></i>
                      </a>
                      <a href="#">
                        <i className="icon-linkedin4"></i>
                      </a>
                    </p>
                    <p>
                      <Link
                        className="btn btn-primary btn-outline"
                        href="/contact"
                      >
                        Contact Me!
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </Waypoint>
          </div>
        </div>
      </div>

      <div id="colorlib-services">
        <div className="container">
          <div className="row text-center">
            <h2 className="bold">Services</h2>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="services-flex">
                <div className="one-third">
                  <div className="row">
                    <Waypoint
                      onEnter={() => handleWaypointEnter("services-0")}
                      bottomOffset="15%"
                    >
                      <div
                        className={`col-md-12 col-md-offset-0 animate-box intro-heading ${
                          animatedItems.includes("services-0")
                            ? "fadeInUp animated"
                            : ""
                        }`}
                      >
                        <span>My Services</span>
                        <h2>Here Are Some of My Skills</h2>
                      </div>
                    </Waypoint>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="rotate">
                        <h2 className="heading">Services</h2>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <Waypoint
                        onEnter={() => handleWaypointEnter("services-1")}
                        bottomOffset="15%"
                      >
                        <div
                          className={`services animate-box ${
                            animatedItems.includes("services-1")
                              ? "fadeInUp animated"
                              : ""
                          }`}
                        >
                          <h3>1 - Front End Development</h3>
                          <ul>
                            <li>HTML / CSS</li>
                            <li>JS &amp; Jquery Startup</li>
                            <li>Bootstrap</li>
                            <li>Tailwind CSS</li>
                            <li>React JS</li>
                            <li>Next JS</li>
                          </ul>
                        </div>
                      </Waypoint>
                      <Waypoint
                        onEnter={() => handleWaypointEnter("services-2")}
                        bottomOffset="15%"
                      >
                        <div
                          className={`services animate-box ${
                            animatedItems.includes("services-2")
                              ? "fadeInUp animated"
                              : ""
                          }`}
                        >
                          <h3>3 - Database</h3>
                          <ul>
                            <li>SQL</li>
                            <li>MySQL</li>
                            <li>MongoDB</li>
                            <li>NoSQL</li>
                            <li>Firebase Realtime DB</li>
                          </ul>
                        </div>
                      </Waypoint>
                    </div>
                    <div className="col-md-6">
                      <Waypoint
                        onEnter={() => handleWaypointEnter("services-3")}
                        bottomOffset="15%"
                      >
                        <div
                          className={`services animate-box ${
                            animatedItems.includes("services-3")
                              ? "fadeInUp animated"
                              : ""
                          }`}
                        >
                          <h3>2 - Back End Development</h3>
                          <ul>
                            <li>Rest API</li>
                            <li>PHP</li>
                            <li>Laravel</li>
                            <li>Node JS</li>
                            <li>Firebase</li>
                            <li>Motoko</li>
                            <li>Version Control (GIT)</li>
                            <li>AWS</li>
                          </ul>
                        </div>
                      </Waypoint>
                      <Waypoint
                        onEnter={() => handleWaypointEnter("services-4")}
                        bottomOffset="15%"
                      >
                        <div
                          className={`services animate-box ${
                            animatedItems.includes("services-4")
                              ? "fadeInUp animated"
                              : ""
                          }`}
                        >
                          <h3>4 - Language</h3>
                          <ul>
                            <li>Indonesia</li>
                            <li>English</li>
                          </ul>
                        </div>
                      </Waypoint>
                    </div>
                  </div>
                </div>
                <div
                  className="one-forth services-img"
                  style={{ backgroundImage: `url(images/services-img-1.jpg)` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="colorlib-work">
        <div className="container">
          <div className="row text-center">
            <h2 className="bold">Works</h2>
          </div>
          <div className="row">
            <Waypoint
              onEnter={() => handleWaypointEnter("work-0")}
              bottomOffset="15%"
            >
              <div
                className={`col-md-12 col-md-offset-0 text-center animate-box intro-heading ${
                  animatedItems.includes("work-0") ? "fadeInUp animated" : ""
                }`}
              >
                <span>Portfolio</span>
                <h2>Done Projects</h2>
              </div>
            </Waypoint>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="rotate">
                <h2 className="heading">Portfolio</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {works.map((work) => (
              <div className="col-md-12" key={work.id}>
                <Waypoint
                  onEnter={() => handleWaypointEnter("work-" + work.id)}
                  bottomOffset="15%"
                >
                  <div
                    className={`work-entry animate-box ${
                      animatedItems.includes("work-" + work.id)
                        ? "fadeInUp animated"
                        : ""
                    }`}
                  >
                    <a
                      href="work.html"
                      className="work-img"
                      style={{
                        backgroundImage: `url(images/work-${work.id}.jpg)`,
                      }}
                    >
                      <div className="display-t">
                        <div className="work-name">
                          <h2>{work.title}</h2>
                        </div>
                      </div>
                    </a>
                    <div className="col-md-4 col-md-offset-4">
                      <div className="desc">
                        <p>{work.desc}</p>
                        {/* <p className="read">
                          <a href="#">View details</a>
                        </p> */}
                      </div>
                    </div>
                  </div>
                </Waypoint>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="colorlib-blog">
        <div className="container">
          <div className="row text-center">
            <h2 className="bold">Blog</h2>
          </div>
          <div className="row">
            <Waypoint
              onEnter={() => handleWaypointEnter("blog-0")}
              bottomOffset="15%"
            >
              <div
                className={`col-md-12 col-md-offset-0 text-center animate-box intro-heading ${
                  animatedItems.includes("blog-0") ? "fadeInUp animated" : ""
                }`}
              >
                <span>Blog</span>
                <h2>Read Our Case</h2>
              </div>
            </Waypoint>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="rotate">
                <h2 className="heading">Our Blog</h2>
              </div>
            </div>
          </div>
          <Waypoint
            onEnter={() => handleWaypointEnter("blog-1")}
            bottomOffset="15%"
          >
            <div
              className={`row animate-box ${
                animatedItems.includes("blog-1") ? "fadeInUp animated" : ""
              }`}
            >
              <OwlCarousel className="owl-carousel1" {...carouselOptions1}>
                <div className="item">
                  <div className="col-md-12">
                    <div className="article">
                      <a href="/blogs/blog" className="blog-img">
                        <Image
                          className="img-responsive"
                          src="images/img-1.jpg"
                          alt="html5 bootstrap by colorlib.com"
                        />
                        <div className="overlay"></div>
                        <div className="link">
                          <span className="read">Read more</span>
                        </div>
                      </a>
                      <div className="desc">
                        <span className="meta">15, Feb 2018</span>
                        <h2>
                          <a href="/blogs/blog">A Japanese Constellation</a>
                        </h2>
                        <p>
                          When she reached the first hills of the Italic
                          Mountains, she had a last view back on the skyline of
                          her hometown Bookmarksgrove
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="col-md-12">
                    <div className="article">
                      <a href="/blogs/blog" className="blog-img">
                        <Image
                          className="img-responsive"
                          src="images/img-2.jpg"
                          alt="html5 bootstrap by colorlib.com"
                        />
                        <div className="overlay"></div>
                        <div className="link">
                          <span className="read">Read more</span>
                        </div>
                      </a>
                      <div className="desc">
                        <span className="meta">15, Feb 2018</span>
                        <h2>
                          <a href="/blogs/blog">A Japanese Constellation</a>
                        </h2>
                        <p>
                          When she reached the first hills of the Italic
                          Mountains, she had a last view back on the skyline of
                          her hometown Bookmarksgrove
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="col-md-12">
                    <div className="article">
                      <a href="/blogs/blog" className="blog-img">
                        <Image
                          className="img-responsive"
                          src="images/img-3.jpg"
                          alt="html5 bootstrap by colorlib.com"
                        />
                        <div className="overlay"></div>
                        <div className="link">
                          <span className="read">Read more</span>
                        </div>
                      </a>
                      <div className="desc">
                        <span className="meta">15, Feb 2018</span>
                        <h2>
                          <a href="/blogs/blog">A Japanese Constellation</a>
                        </h2>
                        <p>
                          When she reached the first hills of the Italic
                          Mountains, she had a last view back on the skyline of
                          her hometown Bookmarksgrove
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </OwlCarousel>
            </div>
          </Waypoint>
        </div>
      </div>
    </>
  );
}
