import { CreateNodeArgs, CreateSchemaCustomizationArgs } from "gatsby"
import { getRecipeIngredientList } from "./gatsby-node.recipe";

export const onCreateNode = async ({ node, actions }: CreateNodeArgs) => {
  const { createNodeField, deleteNode, createNode } = actions
  if (node.internal.type === `GoogleDocs`) {
    const doc = node as unknown as Queries.GoogleDocs;
    if (doc.template !== 'recipe.tsx') return;
    const ingredients = getRecipeIngredientList(doc);
    createNodeField({
      node,
      name: `ingredients`,
      value: ingredients,
    })
  }
}
