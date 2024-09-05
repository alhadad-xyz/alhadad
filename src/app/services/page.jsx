"use client";
import React, { useState } from "react";
import { Waypoint } from "react-waypoint";

const Services = () => {
  const [animatedItems, setAnimatedItems] = useState([]);

  const handleWaypointEnter = (index) => {
    const delay = parseInt(index.split("-").pop(), 0) * 120;

    setTimeout(() => {
      setAnimatedItems((prev) => [...prev, index]);
    }, delay);
  };

  return (
    <>
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

      <div id="colorlib-progress">
        <div className="container">
          <div className="row text-center">
            <h2 className="bold">Skills</h2>
          </div>
          <div className="row">
            <Waypoint
              onEnter={() => handleWaypointEnter("skills-0")}
              bottomOffset="15%"
            >
              <div
                className={`col-md-12 col-md-offset-0 text-center animate-box intro-heading ${
                  animatedItems.includes("skills-0")
                    ? "fadeInUp animated"
                    : ""
                }`}
              >
                <span>Skills</span>
                <h2>My Skills</h2>
              </div>
            </Waypoint>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-6 text-center">
              <h2 className="progress-head">Front End Development</h2>
              <div className="progress blue">
                <span className="progress-left">
                  <span className="progress-bar"></span>
                </span>
                <span className="progress-right">
                  <span className="progress-bar"></span>
                </span>
                <div className="progress-value">75%</div>
              </div>
            </div>

            <div className="col-md-3 col-sm-6 text-center">
              <h2 className="progress-head">Back End Development</h2>
              <div className="progress yellow">
                <span className="progress-left">
                  <span className="progress-bar"></span>
                </span>
                <span className="progress-right">
                  <span className="progress-bar"></span>
                </span>
                <div className="progress-value">100%</div>
              </div>
            </div>

            <div className="col-md-3 col-sm-6 text-center">
              <h2 className="progress-head">Database</h2>
              <div className="progress pink">
                <span className="progress-left">
                  <span className="progress-bar"></span>
                </span>
                <span className="progress-right">
                  <span className="progress-bar"></span>
                </span>
                <div className="progress-value">80%</div>
              </div>
            </div>

            <div className="col-md-3 col-sm-6 text-center">
              <h2 className="progress-head">Language</h2>
              <div className="progress green">
                <span className="progress-left">
                  <span className="progress-bar"></span>
                </span>
                <span className="progress-right">
                  <span className="progress-bar"></span>
                </span>
                <div className="progress-value">90%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
