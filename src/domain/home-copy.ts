import type { ProjectCard as ProjectCardData } from './project-schema'

export type ThemeMode = 'light' | 'dark'
export type LanguageMode = 'zh' | 'en'

export type HomeCopy = {
  authorLabel: string
  authorName: string
  emptyDescription: string
  emptyTitle: string
  authorButtonLabel: string
  authorCloseLabel: string
  githubLabel: string
  languageLabel: string
  languageShortLabel: string
  projectListLabel: string
  themeLabel: string
}

export type ProjectCopy = {
  entrypointLabels?: Record<string, string>
  tagline?: string
}

export const homeCopy: Record<LanguageMode, (themeMode: ThemeMode) => HomeCopy> = {
  zh: (themeMode) => ({
    authorLabel: '@',
    authorName: '赛博许愿机',
    authorButtonLabel: '打开 @赛博许愿机 留言',
    authorCloseLabel: '关闭 @赛博许愿机 对话',
    emptyDescription: '当前 manifest 中没有可展示的 Pokopia 工具。',
    emptyTitle: '暂无项目',
    githubLabel: '打开 GitHub: grigri201',
    languageLabel: '切换到英文',
    languageShortLabel: 'EN',
    projectListLabel: 'Projects',
    themeLabel: themeMode === 'light' ? '切换到深色模式' : '切换到浅色模式',
  }),
  en: (themeMode) => ({
    authorLabel: '@',
    authorName: 'Cyber Wishing Machine',
    authorButtonLabel: 'Open @赛博许愿机 message',
    authorCloseLabel: 'Close @赛博许愿机 dialog',
    emptyDescription: 'The current manifest has no Pokopia tools to show.',
    emptyTitle: 'No projects yet',
    githubLabel: 'Open GitHub: grigri201',
    languageLabel: 'Switch to Chinese',
    languageShortLabel: '中',
    projectListLabel: 'Projects',
    themeLabel: themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode',
  }),
}

export const homeProjectCopy: Record<LanguageMode, Record<string, ProjectCopy>> = {
  zh: {},
  en: {
    'pokopia-decor-dex': {
      tagline: 'A Pokopia dex for Pokemon colors, preference terms, and decor pairings.',
      entrypointLabels: {
        'decor-dex-public-tool': 'Open Decor Dex Tool',
      },
    },
    'pokopia-scene-editor': {
      tagline: 'Record and share your Pokopia scenes on a 7*7 workspace.',
      entrypointLabels: {
        'scene-editor-public-tool': 'Open Scene Editor Tool',
        'scene-editor-local-repo': 'View Local Repository',
        'scene-editor-planning-docs': 'View Planning Docs',
      },
    },
    'pokokit-gallery': {
      tagline: 'Browse public Pokopia scenes and recover the scenes you saved to Gallery.',
      entrypointLabels: {
        'gallery-public-tool': 'Open Gallery',
        'gallery-local-repo': 'View Local Repository',
      },
    },
  },
}

export function localizeHomeProject(
  project: ProjectCardData,
  languageMode: LanguageMode,
): ProjectCardData {
  const copy = homeProjectCopy[languageMode][project.id]

  if (!copy) {
    return project
  }

  return {
    ...project,
    tagline: copy.tagline ?? project.tagline,
    entrypoints: project.entrypoints.map((entrypoint) => ({
      ...entrypoint,
      label: copy.entrypointLabels?.[entrypoint.id] ?? entrypoint.label,
    })),
  }
}
