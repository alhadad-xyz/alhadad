import { Newsreader } from 'next/font/google';
import './globals.css';

const newsreader = Newsreader({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-newsreader' });

export const metadata = { title: 'Alhadad', description: 'Personal site of Alhadad.' };

export default function RootLayout({ children }) {
  return (
    // is-loading is removed by Intro once the preloader finishes.
    <html lang="en" className={`is-loading ${newsreader.variable}`} suppressHydrationWarning>
      <head>
        <noscript><style>{'.preloader { display: none; } html { overflow: auto; }'}</style></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
