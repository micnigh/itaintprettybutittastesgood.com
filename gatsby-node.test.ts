import { parse } from 'recipe-ingredient-parser-v3';
import { markdown } from './gatsby-node.test.fixture';

describe('gatsby-node', () => {
  it('should parse ingredients from recipes', () => {
    const ingredientsCopyMatchAll = [...markdown.matchAll(/#+\s*Ingredients\s*([\s\S]*?)#+/gm)][0]
    if (!ingredientsCopyMatchAll) {
      return;
    }
    const ingredientsCopyMatchGroup = ingredientsCopyMatchAll[1].trim()
    const ingredientsArray = ingredientsCopyMatchGroup.split(' - ').map(s => s.trim()).filter(s => s !== '').map(s => s.replace('- ', ''))
    const ingredients = ingredientsArray.map(i => parse(i, 'eng'))
    console.log(ingredients)
  })
})
