export const dynamic = 'force-static';

// One page: the whole issue lives at /.
export default function sitemap() {
  return [{ url: 'https://alhadad.dev/', changeFrequency: 'monthly', priority: 1 }];
}
