import React from "react"
import styles from "./Footer.module.css"

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerCol}>
          <div className={styles.footerItem}>
            <a href="#">Home</a>
          </div>
          <div className={styles.footerItem}>
            <a href="#">About</a>
          </div>
          <div className={styles.footerItem}>
            <a href="#">Projects</a>
          </div>
          <div className={styles.footerItem}>
            <a href="#">Contact</a>
          </div>
          <div className={styles.footerItem}>
            <a href="#">Blog</a>
          </div>
        </div>
        <div className={styles.footerCol}>
          <div className={styles.footerItem}>
            <a href="#">LinkedIn</a>
          </div>
          <div className={styles.footerItem}>
            <a href="#">GitHub</a>
          </div>
          <div className={styles.footerItem}>
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>
    </div>
  )
} 