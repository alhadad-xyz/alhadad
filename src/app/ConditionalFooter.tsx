'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/components/footer/Footer'

export function ConditionalFooter() {
  const pathname = usePathname()
  const showFooter = pathname !== "/"

  return showFooter ? <Footer /> : null
} 