"use client";
import React, { useState } from "react";
import { Waypoint } from "react-waypoint";

const Works = () => {
  const [animatedItems, setAnimatedItems] = useState([]);

  const handleWaypointEnter = (index) => {
    const delay = parseInt(index.split("-").pop(), 0) * 120;

    setTimeout(() => {
      setAnimatedItems((prev) => [...prev, index]);
    }, delay);
  };
  
  return (
    <>
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
            <div className="col-md-12">
              <Waypoint
                onEnter={() => handleWaypointEnter("work-1")}
                bottomOffset="15%"
              >
                <div
                  className={`work-entry animate-box ${
                    animatedItems.includes("work-1") ? "fadeInUp animated" : ""
                  }`}
                >
                  <a
                    href="work.html"
                    className="work-img"
                    style={{ backgroundImage: `url(images/work-1.jpg)` }}
                  >
                    <div className="display-t">
                      <div className="work-name">
                        <h2>Pursuing Best</h2>
                      </div>
                    </div>
                  </a>
                  <div className="col-md-4 col-md-offset-4">
                    <div className="desc">
                      <p>
                        Far far away, behind the word mountains, far from the
                        countries Vokalia and Consonantia, there live the blind
                        texts. Separated they live in Bookmarksgrove right at
                        the coast of the Semantics, a large language ocean.
                      </p>
                      <p className="read">
                        <a href="#">View details</a>
                      </p>
                    </div>
                  </div>
                </div>
              </Waypoint>
            </div>
            <div className="col-md-12">
              <Waypoint
                onEnter={() => handleWaypointEnter("work-2")}
                bottomOffset="15%"
              >
                <div
                  className={`work-entry animate-box ${
                    animatedItems.includes("work-2") ? "fadeInUp animated" : ""
                  }`}
                >
                  <a
                    href="work.html"
                    className="work-img"
                    style={{ backgroundImage: `url(images/work-2.jpg)` }}
                  >
                    <div className="display-t">
                      <div className="work-name">
                        <h2>Coordinates</h2>
                      </div>
                    </div>
                  </a>
                  <div className="col-md-4 col-md-offset-4">
                    <div className="desc">
                      <p>
                        Far far away, behind the word mountains, far from the
                        countries Vokalia and Consonantia, there live the blind
                        texts. Separated they live in Bookmarksgrove right at
                        the coast of the Semantics, a large language ocean.
                      </p>
                      <p className="read">
                        <a href="#">View Details</a>
                      </p>
                    </div>
                  </div>
                </div>
              </Waypoint>
            </div>
            <div className="col-md-12">
              <Waypoint
                onEnter={() => handleWaypointEnter("work-3")}
                bottomOffset="15%"
              >
                <div
                  className={`work-entry animate-box ${
                    animatedItems.includes("work-3") ? "fadeInUp animated" : ""
                  }`}
                >
                  <a
                    href="work.html"
                    className="work-img"
                    style={{ backgroundImage: `url(images/work-3.jpg)` }}
                  >
                    <div className="display-t">
                      <div className="work-name">
                        <h2>Cristall</h2>
                      </div>
                    </div>
                  </a>
                  <div className="col-md-4 col-md-offset-4">
                    <div className="desc">
                      <p>
                        Far far away, behind the word mountains, far from the
                        countries Vokalia and Consonantia, there live the blind
                        texts. Separated they live in Bookmarksgrove right at
                        the coast of the Semantics, a large language ocean.
                      </p>
                      <p className="read">
                        <a href="#">View Details</a>
                      </p>
                    </div>
                  </div>
                </div>
              </Waypoint>
            </div>
            <div className="col-md-12">
              <Waypoint
                onEnter={() => handleWaypointEnter("work-4")}
                bottomOffset="15%"
              >
                <div
                  className={`work-entry animate-box ${
                    animatedItems.includes("work-4") ? "fadeInUp animated" : ""
                  }`}
                >
                  <a
                    href="work.html"
                    className="work-img"
                    style={{ backgroundImage: `url(images/work-4.jpg)` }}
                  >
                    <div className="display-t">
                      <div className="work-name">
                        <h2>Black</h2>
                      </div>
                    </div>
                  </a>
                  <div className="col-md-4 col-md-offset-4">
                    <div className="desc">
                      <p>
                        Far far away, behind the word mountains, far from the
                        countries Vokalia and Consonantia, there live the blind
                        texts. Separated they live in Bookmarksgrove right at
                        the coast of the Semantics, a large language ocean.
                      </p>
                      <p className="read">
                        <a href="#">View Details</a>
                      </p>
                    </div>
                  </div>
                </div>
              </Waypoint>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Works;
