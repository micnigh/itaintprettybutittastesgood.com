import { CreateNodeArgs, CreateSchemaCustomizationArgs } from "gatsby"
import { parse } from 'recipe-ingredient-parser-v3';

export const onCreateNode = async ({ node, actions }: CreateNodeArgs) => {
  const { createNodeField } = actions
  if (node.internal.type === `GoogleDocs`) {
    const doc = node as unknown as Queries.GoogleDocs;
    // const ingredientsCopy = doc.markdown.matchAll(/#+\s*Ingredients\s*(.*?)\s*#+/gm)[1].trim()
    // const naturalIngredients = ingredientsCopy.split(' - ').map(s => s.trim()).filter(s => s !== '').map(s => s.replace('- ', ''))


    const ingredientsCopyMatchAll = [...doc.markdown.matchAll(/#+\s*Ingredients\s*([\s\S]*?)#+/gm)][0]
    if (!ingredientsCopyMatchAll) {
      return;
    }
    const ingredientsCopyMatchGroup = ingredientsCopyMatchAll[1].trim()
    const ingredientsArray = ingredientsCopyMatchGroup.split(' - ').map(s => s.trim()).filter(s => s !== '').map(s => s.replace('- ', ''))
    const ingredients = ingredientsArray.map(i => { console.log(i); return parse(i, 'eng') })

    createNodeField({
      node,
      name: `ingredients`,
      value: ingredients,
    })
  }
}

export const createSchemaCustomization = async ({ actions }: CreateSchemaCustomizationArgs) => {
  const { createTypes,  } = actions

  createTypes(`#graphql
    type Ingredient {
      quantity: Float
      unit: String
      unitPlural: String
      symbol: String
      ingredient: String
      minQty: Float
      maxQty: Float
    }
    type GoogleDocs implements Node {
      ingredients: [Ingredient!]
    }
  `)
}
