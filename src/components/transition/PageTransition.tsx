'use client'

import { motion } from "framer-motion"
import React, { ReactNode } from "react"
import styles from './PageTransition.module.css'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <>
      {children}
      <motion.div
        className={styles.slideIn}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.75, ease: [0.83, 0, 0.17, 1] }}
      />
      <motion.div
        className={styles.slideOut}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.75, ease: [0.83, 0, 0.17, 1] }}
      />
    </>
  )
} 