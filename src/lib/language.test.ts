import { describe, expect, it } from 'vitest'
import { resolveLanguageMode } from './language'

describe('resolveLanguageMode', () => {
  it('uses Chinese for Chinese browser locales', () => {
    expect(resolveLanguageMode(['zh-CN', 'en-US'])).toBe('zh')
    expect(resolveLanguageMode(['zh-Hant-TW'])).toBe('zh')
  })

  it('uses English for non-Chinese browser locales', () => {
    expect(resolveLanguageMode(['en-US', 'zh-CN'])).toBe('en')
    expect(resolveLanguageMode(['ja-JP'])).toBe('en')
    expect(resolveLanguageMode([])).toBe('en')
  })
})
