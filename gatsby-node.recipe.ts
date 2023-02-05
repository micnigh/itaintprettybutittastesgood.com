import { parse } from 'recipe-ingredient-parser-v3';

export const getRecipeIngredientList = ({ name = '', markdown }) => {
  const sections = markdown.split(/#+/gm).slice(1).map(s => s.trim());
  const ingredientsSection = sections.find(s => /^ingredients/i.test(s));

  const ingredientsCopyMatchAll = [...ingredientsSection.matchAll(/ingredients\s*([\s\S]*)/gim)][0]
  if (!ingredientsCopyMatchAll) {
    console.error(`Could not find ingredients section for ${name}`);
    return null;
  }

  const ingredientsCopyMatchGroup = ingredientsCopyMatchAll[1].trim()
  const ingredientsArray = ingredientsCopyMatchGroup.split(' - ').map(s => s.trim()).filter(s => s !== '').map(s => s.replace('- ', ''))
  const ingredients = ingredientsArray.map(i => {
    let result = null
    try {
      result = parse(i, 'eng')
    } catch (err) {
      console.error(`Failed to parse ${name} ingredient "${i}"`)
    }
    return result;
  }).filter(i => i != null)
  return ingredients
}
