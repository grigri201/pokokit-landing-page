# Blind Hunter Review Prompt

You are reviewing a code diff only. Do not assume access to the project, the spec, or prior conversation. Use the `bmad-review-adversarial-general` stance: prioritize concrete bugs, regressions, security/privacy risks, missing tests, and user-visible breakage.

Return findings only. For each finding include severity, file/line if possible, why it is a problem, and what should change. If no actionable findings exist, say so.

## Diff

```diff
diff --git a/index.html b/index.html
index 4b09ae5..ddab271 100644
--- a/index.html
+++ b/index.html
@@ -1,10 +1,29 @@
 <!doctype html>
-<html lang="zh-CN">
+<html lang="en">
   <head>
     <meta charset="UTF-8" />
     <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
-    <title>Pokopia 工具目录</title>
+    <meta
+      name="description"
+      content="pokokit is the Pokopia tool directory for discovering Decor Dex, Scene Editor, and trusted entrypoints for creative tools."
+    />
+    <meta name="robots" content="index,follow" />
+    <meta property="og:locale" content="en_US" />
+    <meta property="og:site_name" content="pokokit" />
+    <meta property="og:type" content="website" />
+    <meta property="og:title" content="pokokit | Pokopia Tool Directory" />
+    <meta
+      property="og:description"
+      content="Discover Pokopia Decor Dex, Scene Editor, and future ecosystem tools with clear status, purpose, and public entrypoints."
+    />
+    <meta name="twitter:card" content="summary" />
+    <meta name="twitter:title" content="pokokit | Pokopia Tool Directory" />
+    <meta
+      name="twitter:description"
+      content="A Pokopia tool directory for Decor Dex, Scene Editor, and future trusted creative tool entrypoints."
+    />
+    <title>pokokit | Pokopia Tool Directory</title>
   </head>
   <body>
     <div id="root"></div>
diff --git a/src/data/projects.ts b/src/data/projects.ts
index 8d2bede..74fb238 100644
--- a/src/data/projects.ts
+++ b/src/data/projects.ts
@@ -22,7 +22,7 @@ export const projectManifest = {
           kind: 'tool',
           availability: 'available',
           label: '打开 Decor Dex 工具',
-          href: 'https://pokopia-decor-dex.tinytoolshelf.com',
+          href: 'https://decor-dex.pokokit.com',
           note: '外部公开工具入口，将打开 Pokopia Decor Dex。',
           isPrimary: true,
         },
@@ -51,7 +51,7 @@ export const projectManifest = {
       },
       dataFreshness: 'manual',
       problem: '帮助创作者基于 Pokemon 色彩、色板和偏好词找到装饰搭配参考。',
-      maintainerNotes: ['Decor Dex 当前公开入口为发布前待复核配置。'],
+      maintainerNotes: ['Decor Dex 当前公开入口由 landing-page manifest 人工维护。'],
     },
     {
       id: 'pokopia-scene-editor',
diff --git a/src/routes/HomeRoute.test.tsx b/src/routes/HomeRoute.test.tsx
index 7df3867..e59d6d1 100644
--- a/src/routes/HomeRoute.test.tsx
+++ b/src/routes/HomeRoute.test.tsx
@@ -56,7 +56,7 @@ describe('HomeRoute', () => {
     expect(decorCardLink).toContainElement(decorCard)
     expect(decorCardLink).toHaveAttribute(
       'href',
-      'https://pokopia-decor-dex.tinytoolshelf.com',
+      'https://decor-dex.pokokit.com',
     )
     expect(decorCardLink).toHaveAttribute('rel', 'noopener noreferrer')
     expect(within(decorCard).queryByText('查看 Pokemon 主色和色板')).not.toBeInTheDocument()
@@ -148,7 +148,7 @@ describe('HomeRoute', () => {
     expect(within(decorCard).queryByText(/Pokemon 色彩/)).not.toBeInTheDocument()
     expect(screen.getByRole('link', { name: /Open Decor Dex Tool/ })).toHaveAttribute(
       'href',
-      'https://pokopia-decor-dex.tinytoolshelf.com',
+      'https://decor-dex.pokokit.com',
     )

     const sceneCard = screen.getByRole('article', { name: 'Pokopia Scene Editor' })
diff --git a/vitest/seo-metadata.test.ts b/vitest/seo-metadata.test.ts
new file mode 100644
index 0000000..359f129
--- /dev/null
+++ b/vitest/seo-metadata.test.ts
@@ -0,0 +1,66 @@
+import { readFile } from 'node:fs/promises'
+import path from 'node:path'
+import { cwd } from 'node:process'
+import { describe, expect, it } from 'vitest'
+
+const indexHtmlPath = path.join(cwd(), 'index.html')
+const legacyDecorDexUrl = 'https://pokopia-decor-dex.tinytoolshelf.com'
+
+async function loadIndexDocument(): Promise<{ html: string; document: Document }> {
+  const html = await readFile(indexHtmlPath, 'utf8')
+
+  return {
+    html,
+    document: new DOMParser().parseFromString(html, 'text/html'),
+  }
+}
+
+function metaNameContent(document: Document, name: string): string | null {
+  return document
+    .querySelector(`meta[name="${name}"]`)
+    ?.getAttribute('content') ?? null
+}
+
+function metaPropertyContent(document: Document, property: string): string | null {
+  return document
+    .querySelector(`meta[property="${property}"]`)
+    ?.getAttribute('content') ?? null
+}
+
+describe('SEO metadata', () => {
+  it('describes pokokit as the Pokopia tool directory in static HTML', async () => {
+    const { document } = await loadIndexDocument()
+
+    expect(document.documentElement.lang).toBe('en')
+    expect(document.title).toBe('pokokit | Pokopia Tool Directory')
+    expect(metaNameContent(document, 'description')).toContain(
+      'Pokopia tool directory',
+    )
+    expect(metaNameContent(document, 'description')).toContain('Decor Dex')
+    expect(metaNameContent(document, 'robots')).toBe('index,follow')
+    expect(metaPropertyContent(document, 'og:locale')).toBe('en_US')
+    expect(metaPropertyContent(document, 'og:site_name')).toBe('pokokit')
+    expect(metaPropertyContent(document, 'og:type')).toBe('website')
+    expect(metaPropertyContent(document, 'og:title')).toBe(
+      'pokokit | Pokopia Tool Directory',
+    )
+    expect(metaPropertyContent(document, 'og:description')).toContain(
+      'Pokopia Decor Dex',
+    )
+    expect(metaNameContent(document, 'twitter:card')).toBe('summary')
+    expect(metaNameContent(document, 'twitter:title')).toBe(
+      'pokokit | Pokopia Tool Directory',
+    )
+    expect(metaNameContent(document, 'twitter:description')).toContain(
+      'Scene Editor',
+    )
+  })
+
+  it('does not ship unconfirmed site URLs in static SEO metadata', async () => {
+    const { html, document } = await loadIndexDocument()
+
+    expect(html).not.toContain(legacyDecorDexUrl)
+    expect(document.querySelector('link[rel="canonical"]')).toBeNull()
+    expect(metaPropertyContent(document, 'og:url')).toBeNull()
+  })
+})
```
