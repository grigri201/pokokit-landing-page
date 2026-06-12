import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import {
  homeCopy,
  homeProjectCopy,
  type LanguageMode,
  type ThemeMode,
} from './domain/home-copy'
import { resolveLanguageMode } from './lib/language'

const authorIssueUrl =
  'https://github.com/grigri201/pokokit-landing-page/issues/new'
const authorProfileImage = '/cyber-wishing-machine-icon.png'
const authorProfileTitle = '@赛博许愿机'
const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

type OriginalProjectCopy = {
  entrypointLabels: Map<string, string>
  tagline: string
}

const originalProjectCopy = new Map<string, OriginalProjectCopy>()
let languageMode: LanguageMode = 'zh'
let themeMode: ThemeMode = 'light'
let authorModalBackdrop: HTMLDivElement | null = null

function initializeStaticEnhancements() {
  collectOriginalProjectCopy()
  redirectUnsupportedPathToRoot()

  languageMode = getInitialLanguage()
  themeMode = getInitialTheme()

  applyTheme(themeMode)
  applyLanguage(languageMode)

  document
    .querySelector<HTMLButtonElement>('[data-theme-toggle]')
    ?.addEventListener('click', () => {
      applyTheme(themeMode === 'light' ? 'dark' : 'light')
    })

  document
    .querySelector<HTMLButtonElement>('[data-language-toggle]')
    ?.addEventListener('click', () => {
      applyLanguage(languageMode === 'zh' ? 'en' : 'zh')
    })

  document
    .querySelector<HTMLButtonElement>('[data-author-open]')
    ?.addEventListener('click', openAuthorModal)

  window.addEventListener('hashchange', redirectUnsupportedPathToRoot)
  window.addEventListener('popstate', redirectUnsupportedPathToRoot)
}

function getInitialTheme(): ThemeMode {
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  } catch {
    return 'light'
  }
}

function getInitialLanguage(): LanguageMode {
  try {
    const navigatorLanguages = window.navigator.languages
    const locales =
      navigatorLanguages.length > 0
        ? navigatorLanguages
        : [window.navigator.language]

    return resolveLanguageMode(locales)
  } catch {
    return 'zh'
  }
}

function redirectUnsupportedPathToRoot() {
  if (window.location.pathname !== '/' || window.location.hash) {
    window.history.replaceState(null, '', '/')
  }
}

function applyTheme(nextThemeMode: ThemeMode) {
  themeMode = nextThemeMode
  document.documentElement.dataset.theme = themeMode

  const copy = homeCopy[languageMode](themeMode)
  const themeToggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')

  themeToggle?.setAttribute('aria-label', copy.themeLabel)
  themeToggle?.setAttribute('title', copy.themeLabel)
  themeToggle?.setAttribute('aria-pressed', String(themeMode === 'dark'))
}

function applyLanguage(nextLanguageMode: LanguageMode) {
  languageMode = nextLanguageMode
  document.documentElement.lang = languageMode === 'zh' ? 'zh-CN' : 'en'

  const copy = homeCopy[languageMode](themeMode)
  const themeToggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')
  const languageToggle = document.querySelector<HTMLButtonElement>(
    '[data-language-toggle]',
  )
  const authorOpenButton = document.querySelector<HTMLButtonElement>(
    '[data-author-open]',
  )
  const githubLink = document.querySelector<HTMLAnchorElement>('[data-github-link]')
  const projectList = document.querySelector<HTMLElement>('[data-project-list]')
  const authorName = document.querySelector<HTMLElement>('[data-author-name]')

  themeToggle?.setAttribute('aria-label', copy.themeLabel)
  themeToggle?.setAttribute('title', copy.themeLabel)
  languageToggle?.setAttribute('aria-label', copy.languageLabel)
  languageToggle?.setAttribute('title', copy.languageLabel)
  authorOpenButton?.setAttribute('aria-label', copy.authorButtonLabel)
  githubLink?.setAttribute('aria-label', copy.githubLabel)
  projectList?.setAttribute('aria-label', copy.projectListLabel)

  if (languageToggle) {
    languageToggle.textContent = copy.languageShortLabel
  }

  if (authorName) {
    authorName.textContent = copy.authorName
  }

  updateProjectCopy(languageMode)
  updateOpenAuthorModalLabel()
}

function collectOriginalProjectCopy() {
  document.querySelectorAll<HTMLElement>('[data-project-id]').forEach((card) => {
    const projectId = card.dataset.projectId

    if (!projectId) {
      return
    }

    const entrypointLabels = new Map<string, string>()

    card
      .querySelectorAll<HTMLElement>('[data-primary-entrypoint-id]')
      .forEach((entrypoint) => {
        const entrypointId = entrypoint.dataset.primaryEntrypointId
        const label = entrypoint.querySelector<HTMLElement>('span')?.textContent

        if (entrypointId && label) {
          entrypointLabels.set(entrypointId, label)
        }
      })

    originalProjectCopy.set(projectId, {
      entrypointLabels,
      tagline:
        card.querySelector<HTMLElement>('[data-project-tagline]')?.textContent ?? '',
    })
  })
}

function updateProjectCopy(nextLanguageMode: LanguageMode) {
  document.querySelectorAll<HTMLElement>('[data-project-id]').forEach((card) => {
    const projectId = card.dataset.projectId

    if (!projectId) {
      return
    }

    const originalCopy = originalProjectCopy.get(projectId)
    const localizedCopy = homeProjectCopy[nextLanguageMode][projectId]
    const tagline = card.querySelector<HTMLElement>('[data-project-tagline]')

    if (tagline) {
      tagline.textContent = localizedCopy?.tagline ?? originalCopy?.tagline ?? ''
    }

    card
      .querySelectorAll<HTMLElement>('[data-primary-entrypoint-id]')
      .forEach((entrypoint) => {
        const entrypointId = entrypoint.dataset.primaryEntrypointId
        const label = entrypoint.querySelector<HTMLElement>('span')

        if (!entrypointId || !label) {
          return
        }

        label.textContent =
          localizedCopy?.entrypointLabels?.[entrypointId] ??
          originalCopy?.entrypointLabels.get(entrypointId) ??
          label.textContent
      })

    updateProjectLinkLabel(card, projectId)
  })
}

function updateProjectLinkLabel(card: HTMLElement, projectId: string) {
  const projectName = card.querySelector('h3')?.textContent?.trim()
  const entrypointLabel = card
    .querySelector<HTMLElement>('[data-primary-entrypoint-id] span')
    ?.textContent?.trim()
  const projectLink = findProjectLink(projectId)

  if (projectName && entrypointLabel && projectLink) {
    projectLink.setAttribute('aria-label', `${projectName}: ${entrypointLabel}`)
  }
}

function findProjectLink(projectId: string): HTMLAnchorElement | null {
  return (
    Array.from(
      document.querySelectorAll<HTMLAnchorElement>('[data-project-card-link]'),
    ).find((link) => link.dataset.projectCardLink === projectId) ?? null
  )
}

function openAuthorModal() {
  if (authorModalBackdrop) {
    return
  }

  const copy = homeCopy[languageMode](themeMode)
  const appContent = document.querySelector<HTMLElement>('[data-app-content]')
  const authorOpenButton = document.querySelector<HTMLButtonElement>(
    '[data-author-open]',
  )
  const backdrop = document.createElement('div')

  backdrop.className = 'author-modal-backdrop'
  backdrop.innerHTML = authorModalHtml(copy.authorCloseLabel)
  backdrop.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) {
      closeAuthorModal()
    }
  })

  authorModalBackdrop = backdrop
  appContent?.setAttribute('aria-hidden', 'true')
  appContent?.setAttribute('inert', '')
  authorOpenButton?.setAttribute('aria-expanded', 'true')
  document.body.append(backdrop)
  document.addEventListener('keydown', handleAuthorModalKeyDown)

  backdrop
    .querySelector<HTMLButtonElement>('[data-author-close]')
    ?.addEventListener('click', closeAuthorModal)
  backdrop.querySelector<HTMLButtonElement>('[data-author-close]')?.focus()
}

function closeAuthorModal() {
  const appContent = document.querySelector<HTMLElement>('[data-app-content]')
  const authorOpenButton = document.querySelector<HTMLButtonElement>(
    '[data-author-open]',
  )

  authorModalBackdrop?.remove()
  authorModalBackdrop = null
  document.removeEventListener('keydown', handleAuthorModalKeyDown)
  appContent?.removeAttribute('aria-hidden')
  appContent?.removeAttribute('inert')
  authorOpenButton?.setAttribute('aria-expanded', 'false')
  authorOpenButton?.focus()
}

function updateOpenAuthorModalLabel() {
  const closeButton =
    authorModalBackdrop?.querySelector<HTMLButtonElement>('[data-author-close]')

  closeButton?.setAttribute(
    'aria-label',
    homeCopy[languageMode](themeMode).authorCloseLabel,
  )
}

function handleAuthorModalKeyDown(event: KeyboardEvent) {
  if (!authorModalBackdrop) {
    return
  }

  if (event.key === 'Escape') {
    closeAuthorModal()
    return
  }

  if (event.key !== 'Tab') {
    return
  }

  const focusableElements = Array.from(
    authorModalBackdrop.querySelectorAll<HTMLElement>(focusableSelector),
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

function authorModalHtml(closeLabel: string): string {
  return `
    <section
      class="author-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="author-dialog-title"
    >
      <button
        class="author-modal__close"
        data-author-close
        type="button"
        aria-label="${closeLabel}"
      >
        X
      </button>
      <div class="author-modal__portrait">
        <img src="${authorProfileImage}" alt="${authorProfileTitle}" />
      </div>
      <div class="author-modal__chat">
        <h2 id="author-dialog-title">${authorProfileTitle}</h2>
        <div class="author-modal__messages" aria-label="作者留言">
          <p class="author-modal__bubble">感谢你使用 pokokit，希望你喜欢这些工具</p>
          <p class="author-modal__bubble">
            抱歉，因为作者游戏进度比较慢，一些素材没有解锁，可能体积不对。勘误数据或提出建议可以
            <a href="${authorIssueUrl}" rel="noopener noreferrer" target="_blank">发 issue</a>
            或者联系 QQ: 3693767633
          </p>
          <p class="author-modal__bubble">嘿嘿嘿嘿，正在憋一个大活。</p>
          <p class="author-modal__bubble">
            我的初心其实是可以让大家免登录直接使用，随用随走，可是这对保存多张岛建方案不利。我有点犹豫……
          </p>
        </div>
      </div>
    </section>
  `
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeStaticEnhancements)
} else {
  initializeStaticEnhancements()
}
