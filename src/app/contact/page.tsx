'use client'

import React, { useState } from "react"
import PageTransition from "@/components/transition/PageTransition"
import MagneticButton from "@/components/magneticbutton/MagneticButton"
import styles from "./page.module.css"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear status when user starts typing again
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all fields'
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message
        })
        // Reset form
        setFormData({ name: '', email: '', message: '' })
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Failed to send message'
        })
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
                <form onSubmit={handleSubmit}>
                  <div className="input">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="input">
                    <textarea
                      name="message"
                      placeholder="Message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="input">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : 'Submit'}
                    </button>
                  </div>

                  {submitStatus.type && (
                    <div
                      className="input"
                      style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        borderRadius: '4px',
                        backgroundColor: submitStatus.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: submitStatus.type === 'success' ? '#155724' : '#721c24',
                        border: `1px solid ${submitStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                      }}
                    >
                      {submitStatus.message}
                    </div>
                  )}
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
                  Stay updated with the latest trends, tips, and insights in web development and design.
                  Join our community of creative professionals.
                </p>

                <div className="input">
                  <input type="email" placeholder="Email" />
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
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                  </p>
                </div>
                <div className={styles.contactSocialLink}>
                  <p>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                  </p>
                </div>
                <div className={styles.contactSocialLink}>
                  <p>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
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