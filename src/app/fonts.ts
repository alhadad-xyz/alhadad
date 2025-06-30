import localFont from 'next/font/local'

export const rosseta = localFont({
  src: '../../public/fonts/Rosseta.otf',
  display: 'swap',
  variable: '--font-rosseta',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: false
})

export const wremena = localFont({
  src: '../../public/fonts/Wremena_Light.otf',
  display: 'swap',
  variable: '--font-wremena',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: false
}) 