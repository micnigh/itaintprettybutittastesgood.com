export interface Ingredient {
  name: string
  quantity: string | null
  unit: string | null
}

export interface RecipeMetadata {
  date: string
  prep: string
  cook: string
  servings: string
  level: string
  tags: string[]
}

export interface Recipe {
  id: string
  slug: string
  title: string
  ingredients: Ingredient[]
  markdown: string
  summary?: string
  preparation?: string
  metadata?: RecipeMetadata
  heroImage?: string
}

