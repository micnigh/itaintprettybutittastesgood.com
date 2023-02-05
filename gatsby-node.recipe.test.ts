import { getRecipeIngredientList } from './gatsby-node.recipe';
import { markdownCranberryPie, markdownCranberryPieIngredientsAtEnd } from './gatsby-node.recipe.test.fixture';

describe('gatsby-node', () => {
  it('should parse ingredients from recipes', () => {
    const ingredients1 = getRecipeIngredientList({ name: 'jest gatsby-node test', markdown: markdownCranberryPie })
    expect(ingredients1.length).toEqual(9)

    const ingredients2 = getRecipeIngredientList({ name: 'jest gatsby-node test', markdown: markdownCranberryPieIngredientsAtEnd })
    expect(ingredients2.length).toEqual(9)
  })
})
