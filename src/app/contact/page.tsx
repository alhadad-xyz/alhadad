'use client'

import React from "react"
import PageTransition from "@/components/transition/PageTransition"
import MagneticButton from "@/components/magneticbutton/MagneticButton"
import styles from "./page.module.css"

export default function Contact() {
  return (
    <PageTransition>
      <div className={styles.page}>
        <div className={styles.container}>
          <section className={styles.contactHero}>
            <div className={styles.contactRow}>
              <div className={styles.contactCol}></div>
              <div className={styles.contactCol}>
                <h1>
                  Feel free to write me a message <span>or let&apos;s be social!</span>
                </h1>
              </div>
            </div>
          </section>

          <section className={`${styles.section} ${styles.contactForm}`}>
            <div className={styles.contactRow}>
              <div className={styles.contactCol}>
                <p>
                  <span>Contact</span>
                </p>
              </div>
              <div className={styles.contactCol}>
                <form action="">
                  <div className="input">
                    <input type="text" placeholder="Name" />
                  </div>
                  <div className="input">
                    <textarea placeholder="Message" rows={6} />
                  </div>
                  <div className="input">
                    <input type="text" placeholder="Email" />
                    <button>Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          <section className={styles.contactSubscribe}>
            <div className={styles.contactRow}>
              <div className={styles.contactCol}>
                <p>
                  <span>Newsletter</span>
                </p>
              </div>
              <div className={styles.contactCol}>
                <h3>
                  Subscribe to my newsletter to get insights & advice on digital
                  design
                </h3>
                <p>
                  Duis cursus, mi quis viverra ornare, eros dolor interdum nulla,
                  ut commodo diam libero vitae erat. Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Fuga, nobis.
                </p>

                <div className="input">
                  <input type="text" placeholder="Email" />
                  <button>Submit</button>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.contactSocials}>
            <div className={styles.contactRow}>
              <div className={styles.contactCol}>
                <p>
                  <span>Socials</span>
                </p>
              </div>
              <div className={styles.contactCol}>
                <div className={styles.contactSocialLink}>
                  <p>
                    <a href="#">Instagram</a>
                  </p>
                </div>
                <div className={styles.contactSocialLink}>
                  <p>
                    <a href="#">Twitter</a>
                  </p>
                </div>
                <div className={styles.contactSocialLink}>
                  <p>
                    <a href="#">LinkedIn</a>
                  </p>
                </div>
              </div>
            </div>
          </section>
          <MagneticButton />
        </div>
      </div>
    </PageTransition>
  )
} 