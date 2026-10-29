import { Bodoni_Moda, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const bodoni = Bodoni_Moda({ subsets: ['latin'], style: ['normal', 'italic'], axes: ['opsz'], variable: '--font-bodoni' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const metadata = { title: 'Alhadad', description: 'Personal site of Alhadad.' };

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
