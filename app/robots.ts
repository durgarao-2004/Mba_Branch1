import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const BASE_URL = 'https://mba.collabex.online';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/feedback/', '/request/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/feedback/', '/request/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/feedback/', '/request/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
