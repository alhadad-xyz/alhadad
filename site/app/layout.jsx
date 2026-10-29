import { Bodoni_Moda, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const bodoni = Bodoni_Moda({ subsets: ['latin'], style: ['normal', 'italic'], axes: ['opsz'], variable: '--font-bodoni' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

// shortcut: description drafted from the PRD; rewrite it with the real hero line (task 2).
const description = 'Alhadad’s personal site, set as a magazine issue: where it started, the turning point, selected work, what I stand for, and how to get in touch.';

export const metadata = {
  metadataBase: new URL('https://alhadad.dev'),
  title: 'Alhadad',
  description,
  openGraph: { title: 'Alhadad', description, url: '/', siteName: 'Alhadad', type: 'website' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }) {
  return (
    // is-loading is removed by Intro once the preloader finishes.
    <html lang="en" className={`is-loading ${bodoni.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <noscript><style>{'.preloader { display: none; } html { overflow: auto; }'}</style></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
