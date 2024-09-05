"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Waypoint } from "react-waypoint";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Image from "next/image";

const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
  ssr: false,
});

export default function About () {
  const [animatedItems, setAnimatedItems] = useState([]);

  const handleWaypointEnter = (index) => {
    const delay = parseInt(index.split("-").pop(), 0) * 120;

    setTimeout(() => {
      setAnimatedItems((prev) => [...prev, index]);
    }, delay);
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

  return (
    <>
      <div id="colorlib-about">
        <div className="container">
          <div className="row text-center">
            <h2 className="bold">About</h2>
          </div>
          <div className="row row-padded-bottom">
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
                        <i className="icon-dribbble2"></i>
                      </a>
                    </p>
                    <p>
                      <a href="#" className="btn btn-primary btn-outline">
                        Contact Me!
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </Waypoint>
          </div>
          <div className="row">
            <Waypoint
              onEnter={() => handleWaypointEnter("desc-1")}
              bottomOffset="15%"
            >
              <div
                className={`col-md-4 animate-box ${
                  animatedItems.includes("desc-1") ? "fadeInUp animated" : ""
                }`}
              >
                <p>
                  The Big Oxmox advised her not to do so, because there were
                  thousands of bad Commas, wild Question Marks and devious
                  Semikoli, but the Little Blind Text didn’t listen. She packed
                  her seven versalia, put her initial into the belt and made
                  herself on the way.
                </p>
              </div>
            </Waypoint>
            <Waypoint
              onEnter={() => handleWaypointEnter("desc-2")}
              bottomOffset="15%"
            >
              <div
                className={`col-md-4 animate-box ${
                  animatedItems.includes("desc-2") ? "fadeInUp animated" : ""
                }`}
              >
                <p>
                  The Big Oxmox advised her not to do so, because there were
                  thousands of bad Commas, wild Question Marks and devious
                  Semikoli, but the Little Blind Text didn’t listen. She packed
                  her seven versalia, put her initial into the belt and made
                  herself on the way.
                </p>
              </div>
            </Waypoint>
            <Waypoint
              onEnter={() => handleWaypointEnter("desc-3")}
              bottomOffset="15%"
            >
              <div
                className={`col-md-4 animate-box ${
                  animatedItems.includes("desc-3") ? "fadeInUp animated" : ""
                }`}
              >
                <p>
                  The Big Oxmox advised her not to do so, because there were
                  thousands of bad Commas, wild Question Marks and devious
                  Semikoli, but the Little Blind Text didn’t listen. She packed
                  her seven versalia, put her initial into the belt and made
                  herself on the way.
                </p>
              </div>
            </Waypoint>
          </div>
        </div>
      </div>
      <div id="colorlib-services">
        <div className="container">
          <div className="row text-center">
            <h2 className="bold">Goals</h2>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="services-flex">
                <div className="one-third">
                  <div className="row">
                    <Waypoint
                      onEnter={() => handleWaypointEnter("goals-0")}
                      bottomOffset="15%"
                    >
                      <div
                        className={`col-md-12 col-md-offset-0 animate-box intro-heading ${
                          animatedItems.includes("goals-0")
                            ? "fadeInUp animated"
                            : ""
                        }`}
                      >
                        <span>Target</span>
                        <h2>Goals</h2>
                        <p>
                          A small river named Duden flows by their place and
                          supplies it with the necessary regelialia. It is a
                          paradisematic country, in which roasted parts of
                          sentences fly into your mouth.
                        </p>
                      </div>
                    </Waypoint>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="rotate">
                        <h2 className="heading">Goals</h2>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <Waypoint
                        onEnter={() => handleWaypointEnter("goals-1")}
                        bottomOffset="15%"
                      >
                        <div
                          className={`services animate-box ${
                            animatedItems.includes("goals-1")
                              ? "fadeInUp animated"
                              : ""
                          }`}
                        >
                          <h3>1 - High Quality Theme</h3>
                          <p>
                            Even the all-powerful Pointing has no control about
                            the blind texts it is an almost unorthographic life
                            One day however a small line of blind text by the
                            name of Lorem Ipsum decided to leave for the far
                            World of Grammar.
                          </p>
                        </div>
                      </Waypoint>
                      <Waypoint
                        onEnter={() => handleWaypointEnter("goals-2")}
                        bottomOffset="15%"
                      >
                        <div
                          className={`services animate-box ${
                            animatedItems.includes("goals-2")
                              ? "fadeInUp animated"
                              : ""
                          }`}
                        >
                          <h3>2 - Customer Satisfaction</h3>
                          <p>
                            Even the all-powerful Pointing has no control about
                            the blind texts it is an almost unorthographic life
                            One day however a small line of blind text by the
                            name of Lorem Ipsum decided to leave for the far
                            World of Grammar.
                          </p>
                        </div>
                      </Waypoint>
                      <Waypoint
                        onEnter={() => handleWaypointEnter("goals-3")}
                        bottomOffset="15%"
                      >
                        <div
                          className={`services animate-box ${
                            animatedItems.includes("goals-3")
                              ? "fadeInUp animated"
                              : ""
                          }`}
                        >
                          <h3>3 - Well Mentained Sites</h3>
                          <p>
                            Even the all-powerful Pointing has no control about
                            the blind texts it is an almost unorthographic life
                            One day however a small line of blind text by the
                            name of Lorem Ipsum decided to leave for the far
                            World of Grammar.
                          </p>
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
    </>
  );
};