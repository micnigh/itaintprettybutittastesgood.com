import { promises as fs } from 'fs'

export const GENERATED_HERO_PREFIX = 'generated-hero.'

export async function findExistingGeneratedHero(
  recipeDir: string
): Promise<string | null> {
  const entries = await fs.readdir(recipeDir, { withFileTypes: true })
  const found = entries.find(
    (entry) => entry.isFile() && entry.name.startsWith(GENERATED_HERO_PREFIX)
  )
  return found ? found.name : null
}
