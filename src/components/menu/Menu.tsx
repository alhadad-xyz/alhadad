'use client'

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import styles from "./Menu.module.css"
import Link from "next/link"
import { gsap } from "gsap"
import { useDynamicColor } from "@/components/DynamicColorProvider"

// Note: Image constants removed as they are loaded dynamically from CMS settings

export default function Menu() {
  const { isLightBackground, hoveredProject, isWorksPage } = useDynamicColor()

  const menuLinks = [
    { path: "/about", label: "About" },
    { path: "/works", label: "Work" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
  ]

  const menuContainer = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoTitle, setLogoTitle] = useState("Alhadad.")
  const [menuPreviewImages, setMenuPreviewImages] = useState({
    about: "/images/home/portrait.png",
    work: "/images/menu/link-2.jpg",
    blog: "/images/menu/link-3.jpg",
    contact: "/images/menu/link-4.jpg",
  })
  const menuAnimation = useRef<gsap.core.Timeline | null>(null)
  const menuLinksAnimation = useRef<gsap.core.Timeline | null>(null)

  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const settings = await response.json()

        // Ensure logoTitle is a string
        if (settings && typeof settings.logoTitle === 'string') {
          setLogoTitle(settings.logoTitle)
        }

        // Set menu preview images with safety checks
        const newMenuImages = {
          about: settings?.menuPreviewImages?.about?.url || "/images/home/portrait.png",
          work: settings?.menuPreviewImages?.work?.url || "/images/menu/link-2.jpg",
          blog: settings?.menuPreviewImages?.blog?.url || "/images/menu/link-3.jpg",
          contact: settings?.menuPreviewImages?.contact?.url || "/images/menu/link-4.jpg",
        }
        setMenuPreviewImages(newMenuImages)
      } catch (error) {
        console.error('Error fetching settings:', error)
        // Keep defaults if fetch fails
        setLogoTitle("Alhadad.")
        setMenuPreviewImages({
          about: "/images/home/portrait.png",
          work: "/images/menu/link-2.jpg",
          blog: "/images/menu/link-3.jpg",
          contact: "/images/menu/link-4.jpg",
        })
      }
    }

    fetchSettings()
  }, [])

  const toggleMenu = () => {
    try {
      const hamburgerIcon = document.querySelector(`.${styles.hamburgerIcon}`)
      hamburgerIcon?.classList.toggle(styles.active)
      setIsMenuOpen(!isMenuOpen)
    } catch (error) {
      console.error('Error toggling menu:', error)
    }
  }

  const closeMenu = () => {
    try {
      if (isMenuOpen) {
        const hamburgerIcon = document.querySelector(`.${styles.hamburgerIcon}`)
        hamburgerIcon?.classList.toggle(styles.active)
        setIsMenuOpen(false)
      }
    } catch (error) {
      console.error('Error closing menu:', error)
    }
  }

  useEffect(() => {
    try {
      gsap.set(`.${styles.menuLinkItemHolder}`, { y: 125 })

      menuAnimation.current = gsap.timeline({ paused: true }).to(`.${styles.menu}`, {
        duration: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "power4.inOut",
      })

      menuLinksAnimation.current = gsap
        .timeline({ paused: true })
        .to(`.${styles.menuLinkItemHolder}`, {
          y: 0,
          duration: 1.25,
          stagger: 0.075,
          ease: "power3.inOut",
          delay: 0.125,
        })
    } catch (error) {
      console.error('Error initializing menu animations:', error)
    }
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      menuAnimation.current?.play()
      menuLinksAnimation.current?.play()
    } else {
      menuAnimation.current?.reverse()
      menuLinksAnimation.current?.reverse()
    }
  }, [isMenuOpen])

  // Handle link hover animation
  useEffect(() => {
    try {
      const previewContainer = document.querySelector(`.${styles.linkPreviewImg}`)
      const menuLinkItems = document.querySelectorAll(`.${styles.menuLinkItem}`)
      const linkImages = [
        menuPreviewImages.about,
        menuPreviewImages.work,
        menuPreviewImages.blog,
        menuPreviewImages.contact,
      ]

      if (!previewContainer || menuLinkItems.length === 0) {
        return
      }

      let lastHoveredIndex: number | null = null
      const eventListeners: Array<{ element: Element; handler: () => void }> = []

      const handleMouseOver = (index: number) => {
        try {
          if (index !== lastHoveredIndex && previewContainer) {
            const imgContainer = document.createElement("div")
            imgContainer.classList.add(styles.bindNewImg)
            const img = document.createElement("img")
            img.src = linkImages[index]
            img.alt = ""
            imgContainer.appendChild(img)
            previewContainer.appendChild(imgContainer)

            gsap.to(imgContainer, {
              top: "0%",
              left: "0%",
              rotate: 0,
              duration: 1.25,
              ease: "power3.out",
              onComplete: () => {
                gsap.delayedCall(2, () => {
                  try {
                    const allImgContainers = previewContainer?.querySelectorAll(`.${styles.bindNewImg}`)
                    if (allImgContainers && allImgContainers.length > 1) {
                      Array.from(allImgContainers)
                        .slice(0, -1)
                        .forEach((container) => {
                          setTimeout(() => {
                            if (container.parentNode) {
                              container.remove()
                            }
                          }, 2000)
                        })
                    }
                  } catch (cleanupError) {
                    console.error('Error cleaning up image containers:', cleanupError)
                  }
                })
              },
            })

            lastHoveredIndex = index
          }
        } catch (error) {
          console.error('Error handling mouse over:', error)
        }
      }

      menuLinkItems.forEach((item, index) => {
        const handleMouseOverEvent = () => handleMouseOver(index)
        item.addEventListener("mouseover", handleMouseOverEvent)
        eventListeners.push({ element: item, handler: handleMouseOverEvent })
      })

      return () => {
        eventListeners.forEach(({ element, handler }) => {
          element.removeEventListener("mouseover", handler)
        })
      }
    } catch (error) {
      console.error('Error setting up link hover animation:', error)
    }
  }, [menuPreviewImages]) // Re-run when menu preview images change

  // Dynamic text color based on background (only on works page)
  const dynamicTextStyle = {
    color: isWorksPage && hoveredProject && isLightBackground
      ? '#1a1a1a'
      : isWorksPage && hoveredProject && !isLightBackground
        ? '#f5f5f5'
        : undefined
  }

  // Dynamic hamburger icon class based on background (only on works page)
  const hamburgerIconClass = `${styles.hamburgerIcon} ${isWorksPage && hoveredProject && isLightBackground
      ? styles.lightBackground
      : isWorksPage && hoveredProject && !isLightBackground
        ? styles.darkBackground
        : ''
    }`.trim()

  return (
    <div className={styles.menuContainer} ref={menuContainer}>
      <div className={styles.menuBar}>
        <div className={styles.menuLogo} onClick={closeMenu}>
          <Link href="/" style={dynamicTextStyle}>{typeof logoTitle === 'string' ? logoTitle : 'Alhadad.'}</Link>
        </div>
        <div className={styles.menuActions}>
          <div className={styles.menuToggle}>
            <button
              className={hamburgerIconClass}
              onClick={toggleMenu}
            ></button>
          </div>
        </div>
      </div>
      <div className={styles.menu}>
        <div className={styles.linkPreviewImg}>
          <Image src={menuPreviewImages.about} alt="" width={400} height={300} />
          <div className={styles.bindNewImg}>
            <Image src={menuPreviewImages.about} alt="" width={400} height={300} />
          </div>
        </div>
        <div className={styles.menuCol}>
          <div className={styles.menuSubCol}>
            <div className={styles.menuLinks}>
              {menuLinks.map((link, index) => (
                <div
                  key={index}
                  className={styles.menuLinkItem}
                  onClick={toggleMenu}
                >
                  <div className={styles.menuLinkItemHolder}>
                    <Link className={styles.menuLink} href={link.path}>
                      {link.label}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 