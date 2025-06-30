'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import Menu from "@/components/menu/Menu"
import { usePathname } from "next/navigation"

// Dynamic Color Context
interface DynamicColorContextType {
  isLightBackground: boolean
  hoveredProject: number | null
  isWorksPage: boolean
  setIsLightBackground: (isLight: boolean) => void
  setHoveredProject: (project: number | null) => void
}

const DynamicColorContext = createContext<DynamicColorContextType | undefined>(undefined)

export const useDynamicColor = () => {
  const context = useContext(DynamicColorContext)
  if (context === undefined) {
    throw new Error('useDynamicColor must be used within a DynamicColorProvider')
  }
  return context
}

export function DynamicColorProvider({ children }: { children: ReactNode }) {
  const [isLightBackground, setIsLightBackground] = useState(false)
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [isWorksPage, setIsWorksPage] = useState(false)
  const pathname = usePathname()

  // Track if we're on the works page
  useEffect(() => {
    const worksPageActive = pathname === '/works'
    setIsWorksPage(worksPageActive)
    
    // Reset dynamic colors when leaving works page
    if (!worksPageActive) {
      setHoveredProject(null)
      setIsLightBackground(false)
    }
  }, [pathname])

  return (
    <DynamicColorContext.Provider value={{
      isLightBackground,
      hoveredProject,
      isWorksPage,
      setIsLightBackground,
      setHoveredProject
    }}>
      <Menu />
      {children}
    </DynamicColorContext.Provider>
  )
} 