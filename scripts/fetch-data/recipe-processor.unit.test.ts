import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { findExistingGeneratedHero } from './recipe-processor'

let tempDir: string

describe('findExistingGeneratedHero', () => {
  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'recipe-processor-'))
  })

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true })
  })

  it('returns the generated hero filename when present on disk', async () => {
    await fs.writeFile(path.join(tempDir, 'generated-hero.png'), 'png')
    await fs.writeFile(path.join(tempDir, 'other-image.jpg'), 'jpg')

    await expect(findExistingGeneratedHero(tempDir)).resolves.toBe(
      'generated-hero.png'
    )
  })

  it('returns null when no generated hero image exists', async () => {
    await fs.writeFile(path.join(tempDir, 'hero.jpg'), 'jpg')

    await expect(findExistingGeneratedHero(tempDir)).resolves.toBeNull()
  })
})
