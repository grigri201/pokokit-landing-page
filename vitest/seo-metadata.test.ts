import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'
import { describe, expect, it } from 'vitest'

const indexHtmlPath = path.join(cwd(), 'index.html')
const robotsTxtPath = path.join(cwd(), 'public', 'robots.txt')
const sitemapXmlPath = path.join(cwd(), 'public', 'sitemap.xml')
const legacyDecorDexUrl = 'https://pokopia-decor-dex.tinytoolshelf.com'
const siteOrigin = 'https://pokokit.com'

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

describe('SEO metadata', () => {
  it('describes pokokit as the Pokopia tool directory in static HTML', async () => {
    const { document } = await loadIndexDocument()

    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe('pokokit | Pokopia Tool Directory')
    expect(metaNameContent(document, 'description')).toContain(
      'Pokopia tool directory',
    )
    expect(metaNameContent(document, 'description')).toContain('Decor Dex')
    expect(metaNameContent(document, 'robots')).toBe('index,follow')
    expect(metaPropertyContent(document, 'og:locale')).toBe('en_US')
    expect(metaPropertyContent(document, 'og:site_name')).toBe('pokokit')
    expect(metaPropertyContent(document, 'og:type')).toBe('website')
    expect(metaPropertyContent(document, 'og:title')).toBe(
      'pokokit | Pokopia Tool Directory',
    )
    expect(metaPropertyContent(document, 'og:description')).toContain(
      'Pokopia Decor Dex',
    )
    expect(metaNameContent(document, 'twitter:card')).toBe('summary')
    expect(metaNameContent(document, 'twitter:title')).toBe(
      'pokokit | Pokopia Tool Directory',
    )
    expect(metaNameContent(document, 'twitter:description')).toContain(
      'Scene Editor',
    )
  })

  it('does not ship unconfirmed site URLs in static SEO metadata', async () => {
    const { html, document } = await loadIndexDocument()

    expect(html).not.toContain(legacyDecorDexUrl)
    expect(document.querySelector('link[rel="canonical"]')).toBeNull()
    expect(metaPropertyContent(document, 'og:url')).toBeNull()
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
})
