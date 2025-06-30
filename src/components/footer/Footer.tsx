import React from "react"
import Link from "next/link"
import styles from "./Footer.module.css"

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerCol}>
          <div className={styles.footerItem}>
            <Link href="/">Home</Link>
          </div>
          <div className={styles.footerItem}>
            <Link href="/about">About</Link>
          </div>
          <div className={styles.footerItem}>
            <Link href="/works">Works</Link>
          </div>
          <div className={styles.footerItem}>
            <Link href="/contact">Contact</Link>
          </div>
          <div className={styles.footerItem}>
            <Link href="/blog">Blog</Link>
          </div>
        </div>
        <div className={styles.footerCol}>
          <div className={styles.footerItem}>
            <a href="https://www.linkedin.com/in/alhadad-dev/">LinkedIn</a>
          </div>
          <div className={styles.footerItem}>
            <a href="https://github.com/alhadad-xyz">GitHub</a>
          </div>
          <div className={styles.footerItem}>
            <a href="https://www.instagram.com/alhadad.dev/">Instagram</a>
          </div>
        </div>
      </div>
    </div>
  )
} 