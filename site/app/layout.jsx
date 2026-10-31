import { Bodoni_Moda, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const bodoni = Bodoni_Moda({ subsets: ['latin'], style: ['normal', 'italic'], axes: ['opsz'], variable: '--font-bodoni' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

const description = 'Alhadad is an AI engineer who turns complex ideas into lean, working products. A personal site, set as a magazine issue.';

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
        {/* Return visits skip the preloader before first paint, so the cover isn't held for JS (LCP).
            Must match readSeen() and the ?intro check in Intro.jsx. */}
        <script dangerouslySetInnerHTML={{ __html: `try{sessionStorage.getItem("intro-seen")==="1"&&!new URLSearchParams(location.search).has("intro")&&document.documentElement.classList.remove("is-loading")}catch(e){}` }} />
        <noscript><style>{'.preloader { display: none; } html { overflow: auto; }'}</style></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
