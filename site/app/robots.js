// Static export: these files are written to out/ at build time.
export const dynamic = 'force-static';

export default function robots() {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: 'https://alhadad.dev/sitemap.xml' };
}
