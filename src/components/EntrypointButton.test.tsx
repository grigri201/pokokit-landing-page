import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ProjectEntrypoint } from '../domain/project-schema'
import { EntrypointButton } from './EntrypointButton'

function renderEntrypoint(entrypoint: ProjectEntrypoint) {
  render(<EntrypointButton entrypoint={entrypoint} />)
}

describe('EntrypointButton', () => {
  it('labels external targets by entrypoint kind', () => {
    renderEntrypoint({
      id: 'external-docs',
      kind: 'docs',
      availability: 'available',
      label: '查看外部文档',
      href: 'https://example.com/docs',
    })

    expect(screen.getByRole('link', { name: /查看外部文档/ })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
    expect(screen.getByText('外部文档')).toBeInTheDocument()
    expect(screen.queryByText('外部工具')).not.toBeInTheDocument()
  })

  it('keeps generic external links distinct from tool links', () => {
    renderEntrypoint({
      id: 'external-reference',
      kind: 'external',
      availability: 'available',
      label: '查看相关项目',
      href: 'https://example.com/reference',
    })

    expect(screen.getByRole('link', { name: /查看相关项目/ })).toBeInTheDocument()
    expect(screen.getAllByText('外部链接')).toHaveLength(2)
    expect(screen.queryByText('外部工具')).not.toBeInTheDocument()
  })

  it('renders unavailable entrypoint reasons next to the entrypoint label', () => {
    renderEntrypoint({
      id: 'scene-tool-tbd',
      kind: 'tool',
      availability: 'tbd',
      label: '公开工具入口待确认',
      note: 'Scene Editor 仍在开发中，尚未确认公开部署 URL。',
    })

    const note = screen.getByRole('note')

    expect(note).toHaveTextContent('公开工具入口待确认')
    expect(note).toHaveTextContent('待确认')
    expect(note).toHaveTextContent('工具入口')
    expect(note).toHaveTextContent('Scene Editor 仍在开发中，尚未确认公开部署 URL。')
    expect(
      screen.queryByRole('link', { name: /公开工具入口待确认/ }),
    ).not.toBeInTheDocument()
  })
})
