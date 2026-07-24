import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function sitemapPlugin(baseUrl) {
  return {
    name: 'generate-sitemap',
    closeBundle() {
      const origin = (baseUrl || '').replace(/\/$/, '')
      if (!origin || /localhost|127\.0\.0\.1/.test(origin)) {
        console.warn(
          '[seo] Skip sitemap.xml — set VITE_BASE_URL to your live site URL before production build.'
        )
        return
      }

      const urls = [
        { loc: `${origin}/`, priority: '1.0', changefreq: 'weekly' },
        { loc: `${origin}/terms`, priority: '0.5', changefreq: 'monthly' },
      ]

      const body = urls
        .map(
          (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
        )
        .join('\n')

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

      const outDir = path.resolve(__dirname, 'dist')
      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml)
      fs.writeFileSync(
        path.join(outDir, 'robots.txt'),
        `User-agent: *
Allow: /
Allow: /terms

Disallow: /dashboard
Disallow: /dashboard/
Disallow: /auth/
Disallow: /my-resume/

Sitemap: ${origin}/sitemap.xml
`
      )
      console.log(`[seo] Wrote sitemap.xml + robots.txt for ${origin}`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), sitemapPlugin(env.VITE_BASE_URL)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }
})
