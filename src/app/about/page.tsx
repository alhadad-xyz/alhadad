'use client'

import React, { useState, useEffect } from "react"
import PageTransition from "@/components/transition/PageTransition"
import MagneticButton from "@/components/magneticbutton/MagneticButton"
import Marquee from "react-fast-marquee"
import styles from "./page.module.css"

interface AboutContent {
  profileImage?: { url: string; alt: string } | null
  bio: string
  skills: Array<{ skill: string; proficiency: string }>
  experience: Array<{ company: string; role: string; period: string; description: string }>
  contactEmail: string
  contactPhone: string
  contactAddress: string
  technicalSkills: Array<{ category: string; primarySkills: string; secondarySkills: string }>
  marqueeText: string
  introTitle: string
  establishedYear: string
  aboutParagraphs: Array<{ paragraph: string }>
  callToActionTitle: string
  callToActionText: string
  faqs: Array<{ question: string; answer: string }>
}

export default function About() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch('/api/about')
        const data = await response.json()
        setAboutContent(data)
      } catch (error) {
        console.error('Error fetching about content:', error)
        // Keep default content if fetch fails
      } finally {
        setIsLoading(false)
      }
    }

    fetchAboutContent()
  }, [])

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  if (isLoading || !aboutContent) {
    return (
      <PageTransition>
        <div className={styles.aboutPage}>
          <div className="container">
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              Loading...
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className={styles.aboutPage}>
        <div className="container">
          <section className={styles.aboutMarquee}>
            <Marquee>
              <h1>
                {aboutContent.marqueeText || "Transforming Your Digital Presence with Unforgettable Web Animations."}
              </h1>
            </Marquee>
          </section>

          <section className={styles.aboutIntro}>
            <h2>
              {aboutContent.introTitle || "Mohammad Khalid is an innovative Full Stack Developer, based in Pasuruan, specializing in bringing digital experiences to life."}
            </h2>
          </section>

          <section className={styles.aboutIntroCopy}>
            <div className={styles.aboutRow}>
              <div className={styles.aboutCol}>
                <p>
                  <span>{aboutContent.establishedYear || "Est. 1997"}</span>
                </p>
              </div>
              <div className={styles.aboutCol}>
                {aboutContent.aboutParagraphs.map((item, index) => (
                  <h3 key={index} style={index > 0 ? { textIndent: "100px" } : {}}>
                    {item.paragraph}
                </h3>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.aboutPortrait}>
            <div className={styles.aboutRow}>
              <div className={styles.aboutCol}>
                <p>
                  <span>Contact</span>
                </p>
                <br />
                <br />
                <p>
                  <span>Email: </span> <span>{aboutContent.contactEmail || "hello@mohammadkhalid.dev"}</span>
                </p>
                <p>
                  <span>Phone: </span> <span>{aboutContent.contactPhone || "+62 812 3456 7890"}</span>
                </p>
                <p>
                  <span>Address: </span>{" "}
                  <span>{aboutContent.contactAddress || "Pasuruan, East Java, Indonesia"}</span>
                </p>
                <br />
                <br />
                <br />
              </div>
              <div className={styles.aboutCol}>
                <div className={styles.aboutPortraitImg}>
                  <img 
                    src={aboutContent.profileImage?.url || "/images/home/portrait.png"} 
                    alt={aboutContent.profileImage?.alt || "Profile photo"} 
                  />
                </div>

                <div className={styles.faqs}>
                  {aboutContent.faqs.map((faq, index) => (
                    <div key={index} className={styles.faqItem}>
                      <div 
                        className={styles.faqQuestion}
                        onClick={() => toggleFaq(index)}
                      >
                        <div>{faq.question}</div>
                        <span className={styles.faqIcon}>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            width="20px" 
                            height="20px"
                            style={{
                              transform: expandedFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s ease'
                            }}
                          >
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
                            <path d="M0 0h24v24H0V0z" fill="none"></path>
                          </svg>
                        </span>
                      </div>
                      {expandedFaq === index && (
                        <div className={styles.faqAnswer}>
                          <div>{faq.answer}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className={styles.aboutAwards}>
            <div className={styles.aboutRow}>
              <div className={styles.aboutCol}></div>
              <div className={`${styles.aboutCol} ${styles.awardHeader}`}>
                <p>
                  <span>Technical Skills & Tools</span>
                </p>
              </div>
            </div>

            {aboutContent.technicalSkills.map((skillCategory, index) => (
              <div key={index} className={`${styles.aboutRow} ${styles.awardRow}`}>
              <div className={styles.aboutCol}>
                <div className={styles.awardYear}>
                    <p>{skillCategory.category}</p>
                </div>
                <div className={styles.awardView}>
                    <p>{skillCategory.primarySkills}</p>
                </div>
              </div>
              <div className={styles.aboutCol}>
                <div className={styles.awardInfo}>
                    <p>{skillCategory.secondarySkills}</p>
                </div>
                <div className={styles.awardProject}>
                    <p></p>
                </div>
                </div>
              </div>
            ))}
          </section>

          <section className={styles.aboutContact}>
            <div className={styles.aboutContactCopy}>
              <h2>{aboutContent.callToActionTitle || "Let's work together"}</h2>
              <p>
                <span>
                  {aboutContent.callToActionText || "Ready to bring your digital vision to life? Let's collaborate on creating something extraordinary."}
                </span>
              </p>
              <MagneticButton />
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  )
} 