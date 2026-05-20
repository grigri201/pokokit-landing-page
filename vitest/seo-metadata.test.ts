import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'
import { describe, expect, it } from 'vitest'

const indexHtmlPath = path.join(cwd(), 'index.html')
const headersPath = path.join(cwd(), 'public', '_headers')
const redirectsPath = path.join(cwd(), 'public', '_redirects')
const robotsTxtPath = path.join(cwd(), 'public', 'robots.txt')
const sitemapXmlPath = path.join(cwd(), 'public', 'sitemap.xml')
const legacyDecorDexUrl = 'https://pokopia-decor-dex.tinytoolshelf.com'
const siteOrigin = 'https://www.pokokit.com'
const socialImageUrl = `${siteOrigin}/pokemon-portraits/ditto.png`

async function loadIndexDocument(): Promise<{ html: string; document: Document }> {
  const html = await readFile(indexHtmlPath, 'utf8')

  return {
    html,
    document: new DOMParser().parseFromString(html, 'text/html'),
  }
}

function metaNameContent(document: Document, name: string): string | null {
  return document
    .querySelector(`meta[name="${name}"]`)
    ?.getAttribute('content') ?? null
}

function metaPropertyContent(document: Document, property: string): string | null {
  return document
    .querySelector(`meta[property="${property}"]`)
    ?.getAttribute('content') ?? null
}

function jsonLdGraph(document: Document): Record<string, unknown>[] {
  const jsonLdText =
    document.querySelector('script[type="application/ld+json"]')?.textContent ??
    ''
  const parsedJsonLd = JSON.parse(jsonLdText) as {
    '@graph'?: Record<string, unknown>[]
  }

  return parsedJsonLd['@graph'] ?? []
}

describe('SEO metadata', () => {
  it('describes pokokit as the Pokopia tool directory in static HTML', async () => {
    const { html, document } = await loadIndexDocument()

    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe('pokokit | Pokopia Tool Directory')
    expect(html).toMatch(
      /<meta name="description" content="[^"]*Pokopia tool directory[^"]*Decor Dex[^"]*" \/>/,
    )
    expect(metaNameContent(document, 'description')).toContain(
      'Pokopia tool directory',
    )
    expect(metaNameContent(document, 'description')).toContain('Decor Dex')
    expect(metaNameContent(document, 'robots')).toBe('index,follow')
    expect(metaPropertyContent(document, 'og:locale')).toBe('en_US')
    expect(metaPropertyContent(document, 'og:site_name')).toBe('pokokit')
    expect(metaPropertyContent(document, 'og:type')).toBe('website')
    expect(metaPropertyContent(document, 'og:url')).toBe(`${siteOrigin}/`)
    expect(metaPropertyContent(document, 'og:title')).toBe(
      'pokokit | Pokopia Tool Directory',
    )
    expect(metaPropertyContent(document, 'og:description')).toContain(
      'Pokopia Decor Dex',
    )
    expect(metaPropertyContent(document, 'og:image')).toBe(socialImageUrl)
    expect(metaPropertyContent(document, 'og:image:width')).toBe('512')
    expect(metaPropertyContent(document, 'og:image:height')).toBe('512')
    expect(metaPropertyContent(document, 'og:image:alt')).toBe(
      'pokokit Pokopia tool directory preview',
    )
    expect(metaNameContent(document, 'twitter:card')).toBe('summary')
    expect(metaNameContent(document, 'twitter:url')).toBe(`${siteOrigin}/`)
    expect(metaNameContent(document, 'twitter:title')).toBe(
      'pokokit | Pokopia Tool Directory',
    )
    expect(metaNameContent(document, 'twitter:description')).toContain(
      'Scene Editor',
    )
    expect(metaNameContent(document, 'twitter:image')).toBe(socialImageUrl)
    expect(metaNameContent(document, 'twitter:image:alt')).toBe(
      'pokokit Pokopia tool directory preview',
    )
  })

  it('sets a canonical URL for the www public root only', async () => {
    const { document } = await loadIndexDocument()

    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe(`${siteOrigin}/`)
  })

  it('does not ship legacy or unconfirmed site URLs in static SEO metadata', async () => {
    const { html, document } = await loadIndexDocument()

    expect(html).not.toContain(legacyDecorDexUrl)
    expect(html).not.toContain('https://pokokit.com/')
    expect(html).not.toContain('https://scene-editor.pokokit.com')
    expect(metaPropertyContent(document, 'og:url')).toBe(`${siteOrigin}/`)
  })

  it('publishes JSON-LD structured data for the directory and project list', async () => {
    const { document } = await loadIndexDocument()
    const graph = jsonLdGraph(document)
    const website = graph.find((node) => node['@type'] === 'WebSite')
    const publisher = graph.find((node) => node['@type'] === 'Person')
    const projectList = graph.find((node) => node['@type'] === 'ItemList') as
      | {
          itemListElement?: Array<{
            item?: {
              '@type'?: string
              name?: string
              url?: string
            }
          }>
        }
      | undefined
    const projectNames =
      projectList?.itemListElement?.map((element) => element.item?.name) ?? []

    expect(website).toMatchObject({
      '@id': `${siteOrigin}/#website`,
      name: 'pokokit',
      url: `${siteOrigin}/`,
      inLanguage: 'en',
    })
    expect(publisher).toMatchObject({
      '@id': `${siteOrigin}/#publisher`,
      name: 'grigri201',
      url: 'https://github.com/grigri201',
    })
    expect(projectList).toMatchObject({
      '@id': `${siteOrigin}/#project-list`,
      name: 'Pokopia tools',
    })
    expect(projectNames).toEqual([
      'Pokopia Decor Dex',
      'Pokopia Scene Editor',
    ])
    expect(projectList?.itemListElement?.[0]?.item).toMatchObject({
      '@type': 'WebApplication',
      name: 'Pokopia Decor Dex',
      url: 'https://decor-dex.pokokit.com',
    })
    expect(projectList?.itemListElement?.[1]?.item?.url).toBeUndefined()
  })

  it('exposes crawler discovery files for the root landing page', async () => {
    const robotsText = await readFile(robotsTxtPath, 'utf8')
    const sitemapText = await readFile(sitemapXmlPath, 'utf8')
    const sitemapDocument = new DOMParser().parseFromString(
      sitemapText,
      'application/xml',
    )

    expect(robotsText.trim().split(/\n+/)).toEqual([
      'User-agent: *',
      'Allow: /',
      `Sitemap: ${siteOrigin}/sitemap.xml`,
    ])
    expect(
      Array.from(sitemapDocument.querySelectorAll('loc')).map(
        (element) => element.textContent,
      ),
    ).toEqual([`${siteOrigin}/`])
    expect(
      Array.from(sitemapDocument.querySelectorAll('changefreq')).map(
        (element) => element.textContent,
      ),
    ).toEqual(['weekly'])
    expect(
      Array.from(sitemapDocument.querySelectorAll('priority')).map(
        (element) => element.textContent,
      ),
    ).toEqual(['1.0'])
    expect(sitemapText).not.toContain(legacyDecorDexUrl)
    expect(sitemapText).not.toContain('decor-dex.pokokit.com')
  })

  it('ships static host headers and redirects without a wildcard SPA rewrite', async () => {
    const headersText = await readFile(headersPath, 'utf8')
    const redirectsText = await readFile(redirectsPath, 'utf8')

    expect(headersText).toContain('/')
    expect(headersText).toContain('/index.html')
    expect(headersText).toContain('/assets/*')
    expect(headersText).toContain('/pokemon-portraits/*')
    expect(headersText).toContain('/robots.txt')
    expect(headersText).toContain('/sitemap.xml')
    expect(headersText).toContain(
      'Cache-Control: public, max-age=0, must-revalidate',
    )
    expect(headersText).toContain(
      'Cache-Control: public, max-age=31536000, immutable',
    )
    expect(headersText).toContain('X-Content-Type-Options: nosniff')
    expect(headersText).toContain('X-Frame-Options: DENY')
    expect(headersText).toContain(
      'Referrer-Policy: strict-origin-when-cross-origin',
    )
    expect(headersText).toContain(
      'Permissions-Policy: camera=(), microphone=(), geolocation=()',
    )
    expect(redirectsText.trim().split(/\n+/)).toEqual([
      '/index.html  /  301',
      '/projects/*  /  301',
    ])
    expect(redirectsText).not.toMatch(/\/\*\s+\/index\.html\s+200/)
    expect(redirectsText).not.toMatch(/\/\*\s+\/\s+200/)
  })
})
