"use client";
import React, { useState } from "react";
import { Waypoint } from "react-waypoint";

const Contact = () => {
  const [animatedItems, setAnimatedItems] = useState([]);

  const handleWaypointEnter = (index) => {
    const delay = parseInt(index.split("-").pop(), 0) * 120;

    setTimeout(() => {
      setAnimatedItems((prev) => [...prev, index]);
    }, delay);
  };

  return (
    <div id="colorlib-contact">
      <div className="container">
        <div className="row text-center">
          <h2 className="bold">Contact</h2>
        </div>
        <div className="row">
          <Waypoint
            onEnter={() => handleWaypointEnter("contact-0")}
            bottomOffset="15%"
          >
            <div
              className={`col-md-12 col-md-offset-0 text-center animate-box intro-heading ${
                animatedItems.includes("contact-0") ? "fadeInUp animated" : ""
              }`}
            >
              <span>Contact</span>
              <h2>Contact Me</h2>
            </div>
          </Waypoint>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="rotate">
              <h2 className="heading">Contact</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-md-offset-0">
            <div className="row">
              <Waypoint
                onEnter={() => handleWaypointEnter("contact-1")}
                bottomOffset="15%"
              >
                <div
                  className={`col-md-4 animate-box ${
                    animatedItems.includes("contact-1")
                      ? "fadeInUp animated"
                      : ""
                  }`}
                >
                  <h3>My Address</h3>
                  <ul className="contact-info">
                    <li>
                      <span>
                        <i className="icon-map5"></i>
                      </span>
                      Sukorejo, Pasuruan, East Java, Indonesia
                    </li>
                    <li>
                      <span>
                        <i className="icon-phone4"></i>
                      </span>
                      +628229310530
                    </li>
                    <li>
                      <span>
                        <i className="icon-envelope2"></i>
                      </span>
                      <a href="#">alhadad.xyz@gmail.com</a>
                    </li>
                  </ul>
                </div>
              </Waypoint>

              <Waypoint
                onEnter={() => handleWaypointEnter("contact-1")}
                bottomOffset="15%"
              >
                <div
                  className={`col-md-7 col-md-push-1 animate-box ${
                    animatedItems.includes("contact-1")
                      ? "fadeInUp animated"
                      : ""
                  }`}
                >
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <textarea
                          name=""
                          className="form-control"
                          id=""
                          cols="30"
                          rows="7"
                          placeholder="Message"
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Name"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <input
                          type="submit"
                          value="Send Message"
                          className="btn btn-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Waypoint>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
