import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { findExistingGeneratedHero } from './hero-image'

let tempDir: string

describe('findExistingGeneratedHero', () => {
  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'hero-image-'))
  })

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true })
  })

  it('returns generated hero filename when present on disk', async () => {
    await fs.writeFile(
      path.join(tempDir, 'generated-hero.webp'),
      Buffer.from('fake-image')
    )

    await expect(findExistingGeneratedHero(tempDir)).resolves.toBe(
      'generated-hero.webp'
    )
  })

  it('returns null when no generated hero file exists', async () => {
    await fs.writeFile(path.join(tempDir, 'index.json'), '{}')
    await fs.writeFile(path.join(tempDir, 'photo.jpg'), Buffer.from('photo'))

    await expect(findExistingGeneratedHero(tempDir)).resolves.toBeNull()
  })

  it('ignores generated hero files in subdirectories', async () => {
    const nestedDir = path.join(tempDir, 'nested')
    await fs.mkdir(nestedDir)
    await fs.writeFile(
      path.join(nestedDir, 'generated-hero.png'),
      Buffer.from('nested')
    )

    await expect(findExistingGeneratedHero(tempDir)).resolves.toBeNull()
  })
})
