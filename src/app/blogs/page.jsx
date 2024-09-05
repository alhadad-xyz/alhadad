"use client";
import React, { useState } from "react";
import { Waypoint } from "react-waypoint";

const Blogs = () => {
  const [animatedItems, setAnimatedItems] = useState([]);

  const handleWaypointEnter = (index) => {
    const delay = parseInt(index.split("-").pop(), 0) * 120;

    setTimeout(() => {
      setAnimatedItems((prev) => [...prev, index]);
    }, delay);
  };

  return (
    <>
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
          <div className="row">
            <div className="col-md-4">
              <Waypoint
                onEnter={() => handleWaypointEnter("blog-1")}
                bottomOffset="15%"
              >
                <div
                  className={`article animate-box ${
                    animatedItems.includes("blog-1") ? "fadeInUp animated" : ""
                  }`}
                >
                  <a href="blog.html" className="blog-img">
                    <img
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
                      <a href="blog.html">A Japanese Constellation 1</a>
                    </h2>
                    <p>
                      When she reached the first hills of the Italic Mountains,
                      she had a last view back on the skyline of her hometown
                      Bookmarksgrove
                    </p>
                  </div>
                </div>
              </Waypoint>

              <Waypoint
                onEnter={() => handleWaypointEnter("blog-4")}
                bottomOffset="15%"
              >
                <div
                  className={`article animate-box ${
                    animatedItems.includes("blog-4") ? "fadeInUp animated" : ""
                  }`}
                >
                  <a href="blog.html" className="blog-img">
                    <img
                      className="img-responsive"
                      src="images/img-4.jpg"
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
                      <a href="blog.html">A Japanese Constellation 2</a>
                    </h2>
                    <p>
                      When she reached the first hills of the Italic Mountains,
                      she had a last view back on the skyline of her hometown
                      Bookmarksgrove
                    </p>
                  </div>
                </div>
              </Waypoint>

              <Waypoint
                onEnter={() => handleWaypointEnter("blog-7")}
                bottomOffset="15%"
              >
                <div
                  className={`article animate-box ${
                    animatedItems.includes("blog-7") ? "fadeInUp animated" : ""
                  }`}
                >
                  <a href="blog.html" className="blog-img">
                    <img
                      className="img-responsive"
                      src="images/img-7.jpg"
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
                      <a href="blog.html">A Japanese Constellation 3</a>
                    </h2>
                    <p>
                      When she reached the first hills of the Italic Mountains,
                      she had a last view back on the skyline of her hometown
                      Bookmarksgrove
                    </p>
                  </div>
                </div>
              </Waypoint>
            </div>

            <div className="col-md-4">
              <Waypoint
                onEnter={() => handleWaypointEnter("blog-2")}
                bottomOffset="15%"
              >
                <div
                  className={`article animate-box ${
                    animatedItems.includes("blog-2") ? "fadeInUp animated" : ""
                  }`}
                >
                  <a href="blog.html" className="blog-img">
                    <img
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
                      <a href="blog.html">A Japanese Constellation 4</a>
                    </h2>
                    <p>
                      When she reached the first hills of the Italic Mountains,
                      she had a last view back on the skyline of her hometown
                      Bookmarksgrove
                    </p>
                  </div>
                </div>
              </Waypoint>

              <Waypoint
                onEnter={() => handleWaypointEnter("blog-5")}
                bottomOffset="15%"
              >
                <div
                  className={`article animate-box ${
                    animatedItems.includes("blog-5") ? "fadeInUp animated" : ""
                  }`}
                >
                  <a href="blog.html" className="blog-img">
                    <img
                      className="img-responsive"
                      src="images/img-5.jpg"
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
                      <a href="blog.html">A Japanese Constellation 4</a>
                    </h2>
                    <p>
                      When she reached the first hills of the Italic Mountains,
                      she had a last view back on the skyline of her hometown
                      Bookmarksgrove
                    </p>
                  </div>
                </div>
              </Waypoint>

              <Waypoint
                onEnter={() => handleWaypointEnter("blog-6")}
                bottomOffset="15%"
              >
                <div
                  className={`article animate-box ${
                    animatedItems.includes("blog-6") ? "fadeInUp animated" : ""
                  }`}
                >
                  <a href="blog.html" className="blog-img">
                    <img
                      className="img-responsive"
                      src="images/img-6.jpg"
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
                      <a href="blog.html">A Japanese Constellation 4</a>
                    </h2>
                    <p>
                      When she reached the first hills of the Italic Mountains,
                      she had a last view back on the skyline of her hometown
                      Bookmarksgrove
                    </p>
                  </div>
                </div>
              </Waypoint>
            </div>

            <div className="col-md-4">
              <Waypoint
                onEnter={() => handleWaypointEnter("blog-3")}
                bottomOffset="15%"
              >
                <div
                  className={`article animate-box ${
                    animatedItems.includes("blog-3") ? "fadeInUp animated" : ""
                  }`}
                >
                  <a href="blog.html" className="blog-img">
                    <img
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
                      <a href="blog.html">A Japanese Constellation 4</a>
                    </h2>
                    <p>
                      When she reached the first hills of the Italic Mountains,
                      she had a last view back on the skyline of her hometown
                      Bookmarksgrove
                    </p>
                  </div>
                </div>
              </Waypoint>

              <Waypoint
                onEnter={() => handleWaypointEnter("blog-8")}
                bottomOffset="15%"
              >
                <div
                  className={`article animate-box ${
                    animatedItems.includes("blog-8") ? "fadeInUp animated" : ""
                  }`}
                >
                  <a href="blog.html" className="blog-img">
                    <img
                      className="img-responsive"
                      src="images/img-8.jpg"
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
                      <a href="blog.html">A Japanese Constellation 4</a>
                    </h2>
                    <p>
                      When she reached the first hills of the Italic Mountains,
                      she had a last view back on the skyline of her hometown
                      Bookmarksgrove
                    </p>
                  </div>
                </div>
              </Waypoint>

              <Waypoint
                onEnter={() => handleWaypointEnter("blog-9")}
                bottomOffset="15%"
              >
                <div
                  className={`article animate-box ${
                    animatedItems.includes("blog-9") ? "fadeInUp animated" : ""
                  }`}
                >
                  <a href="blog.html" className="blog-img">
                    <img
                      className="img-responsive"
                      src="images/img-9.jpg"
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
                      <a href="blog.html">A Japanese Constellation 4</a>
                    </h2>
                    <p>
                      When she reached the first hills of the Italic Mountains,
                      she had a last view back on the skyline of her hometown
                      Bookmarksgrove
                    </p>
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

export default Blogs;
