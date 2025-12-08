'use client'

import React, { useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import styles from "./MagneticButton.module.css"
import gsap from "gsap"

export default function MagneticButton() {
  const btnRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const wrapper = wrapperRef.current
      const btn = btnRef.current
      const text = textRef.current

      if (!wrapper || !btn || !text) return

      const moveEvent = (e: MouseEvent) => {
        try {
          const wrapperRect = wrapper.getBoundingClientRect()

          const relX = e.clientX - (wrapperRect.left + wrapperRect.width / 2)
          const relY = e.clientY - (wrapperRect.top + wrapperRect.height / 2)

          const btnMaxDisplacement = 50
          const textMaxDisplacement = 60

          const btnDisplacementX = (relX / wrapperRect.width) * btnMaxDisplacement
          const btnDisplacementY = (relY / wrapperRect.height) * btnMaxDisplacement
          const textDisplacementX = (relX / wrapperRect.width) * textMaxDisplacement
          const textDisplacementY = (relY / wrapperRect.height) * textMaxDisplacement

          gsap.to(btn, {
            x: btnDisplacementX,
            y: btnDisplacementY,
            ease: "power3.out",
            duration: 0.35,
          })

          gsap.to(text, {
            x: textDisplacementX,
            y: textDisplacementY,
            ease: "power3.out",
            duration: 0.35,
          })
        } catch (error) {
          console.error('Error in move event:', error)
        }
      }

      const leaveEvent = () => {
        try {
          gsap.to([btn, text], {
            x: 0,
            y: 0,
            ease: "power3.out",
            duration: 1,
          })
        } catch (error) {
          console.error('Error in leave event:', error)
        }
      }

      wrapper.addEventListener("mousemove", moveEvent)
      wrapper.addEventListener("mouseleave", leaveEvent)

      return () => {
        wrapper.removeEventListener("mousemove", moveEvent)
        wrapper.removeEventListener("mouseleave", leaveEvent)
      }
    } catch (error) {
      console.error('Error setting up magnetic button:', error)
    }
  }, [])

  return (
    <div className={styles.mBtnWrapper} ref={wrapperRef}>
      <Link href="/">
        <div className={styles.mBtn} ref={btnRef}>
          <div className={styles.arrowRight}>
            <Image
              src="https://assets-global.website-files.com/61385c793ab59f1f6a3372f7/613b078390142aafe0cdc267_arrow-next_white.svg"
              alt="Arrow icon"
              width={20}
              height={20}
            />
          </div>
          <div className={styles.mBtnCopy}>
            <p ref={textRef}>
              {" "}
              Explore <br /> Work Detail
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
} 