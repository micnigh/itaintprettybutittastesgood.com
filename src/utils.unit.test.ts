import { describe, it, expect } from 'vitest'
import { slugify } from './utils/string'

describe('slugify', () => {
  it('should convert text to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('should replace spaces with hyphens', () => {
    expect(slugify('Hello World Test')).toBe('hello-world-test')
  })

  it('should remove non-word characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
  })

  it('should replace multiple hyphens with single hyphen', () => {
    expect(slugify('Hello---World')).toBe('hello-world')
  })

  it('should trim hyphens from start and end', () => {
    expect(slugify('-Hello World-')).toBe('hello-world')
  })

  it('should handle empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('should handle string with only special characters', () => {
    expect(slugify('!!!')).toBe('')
  })

  it('should handle multiple spaces', () => {
    expect(slugify('Hello    World')).toBe('hello-world')
  })
})
