import { useEffect, useRef, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { ProjectCard } from '../components/ProjectCard'
import { projects } from '../data/projects'
import type { ProjectCard as ProjectCardData } from '../domain/project-schema'

type HomeRouteProps = {
  projectList?: ProjectCardData[]
  languageMode?: LanguageMode
  themeMode?: 'light' | 'dark'
  onLanguageToggle?: () => void
  onThemeToggle?: () => void
}

type LanguageMode = 'zh' | 'en'

type HomeCopy = {
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

type ProjectCopy = {
  entrypointLabels?: Record<string, string>
  tagline?: string
}

const homeCopy: Record<LanguageMode, (themeMode: 'light' | 'dark') => HomeCopy> = {
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

const homeProjectCopy: Record<LanguageMode, Record<string, ProjectCopy>> = {
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
  },
}

const authorProfileTitle = '@赛博许愿机'
const authorProfileImage = '/cyber-wishing-machine-icon.png'
const authorIssueUrl =
  'https://github.com/grigri201/pokokit-landing-page/issues/new'
const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function localizeHomeProject(
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

export function HomeRoute({
  projectList = projects,
  languageMode = 'zh',
  themeMode = 'light',
  onLanguageToggle,
  onThemeToggle,
}: HomeRouteProps) {
  const copy = homeCopy[languageMode](themeMode)
  const [authorModalOpen, setAuthorModalOpen] = useState(false)
  const authorButtonRef = useRef<HTMLButtonElement>(null)
  const authorCloseButtonRef = useRef<HTMLButtonElement>(null)
  const appContentRef = useRef<HTMLDivElement>(null)
  const authorDialogRef = useRef<HTMLElement>(null)
  const shouldRestoreAuthorFocusRef = useRef(false)
  const visibleProjects = projectList.map((project) =>
    localizeHomeProject(project, languageMode),
  )

  useEffect(() => {
    if (!authorModalOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setAuthorModalOpen(false)
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = Array.from(
        authorDialogRef.current?.querySelectorAll<HTMLElement>(
          focusableSelector,
        ) ?? [],
      )

      if (focusableElements.length === 0) {
        event.preventDefault()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
        return
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    appContentRef.current?.setAttribute('inert', '')
    window.addEventListener('keydown', handleKeyDown)
    authorCloseButtonRef.current?.focus()

    return () => {
      appContentRef.current?.removeAttribute('inert')
      window.removeEventListener('keydown', handleKeyDown)

      if (
        shouldRestoreAuthorFocusRef.current &&
        authorButtonRef.current &&
        document.contains(authorButtonRef.current)
      ) {
        authorButtonRef.current.focus()
      }
    }
  }, [authorModalOpen])

  function openAuthorModal() {
    shouldRestoreAuthorFocusRef.current = true
    setAuthorModalOpen(true)
  }

  function handleAuthorBackdropClick(
    event: React.MouseEvent<HTMLDivElement>,
  ) {
    if (event.target === event.currentTarget) {
      setAuthorModalOpen(false)
    }
  }

  return (
    <>
      <div
        className="app-content"
        ref={appContentRef}
        aria-hidden={authorModalOpen ? 'true' : undefined}
      >
        <header className="top-banner">
          <div className="top-banner__inner">
            <h1 id="page-title">pokokit</h1>
            <div className="top-banner__actions">
              <button
                className="theme-toggle"
                type="button"
                aria-label={copy.themeLabel}
                title={copy.themeLabel}
                aria-pressed={themeMode === 'dark'}
                onClick={onThemeToggle}
              >
                <svg viewBox="0 0 18 18" aria-hidden="true" focusable="false">
                  <circle cx="9" cy="9" r="6.5" />
                  <path d="M9 2.5a6.5 6.5 0 0 1 0 13Z" />
                </svg>
              </button>
              <button
                className="language-toggle"
                type="button"
                aria-label={copy.languageLabel}
                title={copy.languageLabel}
                onClick={onLanguageToggle}
              >
                {copy.languageShortLabel}
              </button>
              <button
                className="author-link"
                type="button"
                aria-expanded={authorModalOpen}
                aria-haspopup="dialog"
                aria-label={copy.authorButtonLabel}
                title={authorProfileTitle}
                ref={authorButtonRef}
                onClick={openAuthorModal}
              >
                <img src={authorProfileImage} alt="" aria-hidden="true" />
              </button>
              <a
                className="github-link"
                href="https://github.com/grigri201"
                rel="noopener noreferrer"
                target="_blank"
                aria-label={copy.githubLabel}
                title="GitHub: grigri201"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.52 2.86 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.9-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.67.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.93c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.2 10.2 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
                </svg>
              </a>
            </div>
          </div>
        </header>

        <main className="app-shell">
          <div className="home-content">
            <section className="project-section">
              {visibleProjects.length > 0 ? (
                <ul className="project-grid" aria-label={copy.projectListLabel}>
                  {visibleProjects.map((project) => (
                    <li key={project.id}>
                      <ProjectCard project={project} />
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title={copy.emptyTitle}
                  description={copy.emptyDescription}
                />
              )}
            </section>
          </div>
        </main>

        <footer className="site-footer" aria-label={copy.authorLabel}>
          <span>{copy.authorLabel}</span>
          <strong>{copy.authorName}</strong>
        </footer>
      </div>

      {authorModalOpen ? (
        <div
          className="author-modal-backdrop"
          onClick={handleAuthorBackdropClick}
        >
          <section
            className="author-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="author-dialog-title"
            ref={authorDialogRef}
          >
            <button
              className="author-modal__close"
              type="button"
              aria-label={copy.authorCloseLabel}
              ref={authorCloseButtonRef}
              onClick={() => setAuthorModalOpen(false)}
            >
              X
            </button>
            <div className="author-modal__portrait">
              <img src={authorProfileImage} alt={authorProfileTitle} />
            </div>
            <div className="author-modal__chat">
              <h2 id="author-dialog-title">{authorProfileTitle}</h2>
              <div className="author-modal__messages" aria-label="作者留言">
                <p className="author-modal__bubble">
                  感谢你使用 pokokit，希望你喜欢这些工具
                </p>
                <p className="author-modal__bubble">
                  抱歉因为作者进度比较慢，一些素材没有解锁，可能体积不对。勘误数据或提出建议可以{' '}
                  <a
                    href={authorIssueUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    发 issue
                  </a>{' '}
                  或者联系 QQ: 3693767633
                </p>
                <p className="author-modal__bubble">
                  岛建进度完全落后了，人为什么需要睡觉
                </p>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
