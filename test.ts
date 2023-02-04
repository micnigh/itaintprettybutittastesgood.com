import { parse } from 'recipe-ingredient-parser-v3';
import fixture from './test.fixture.js';

console.log(fixture)

const test = `
 - 4 cups fresh cranberries or frozen
 - 1 orange (zest then juice) if you don’t want to juice it yourself then like a 1/2c oj
 - 1 ½ cups sugar
 - 1 tablespoon salt
 - 1 tablespoons flour
 - 1 packet gelatin (.25oz)
 - 1 store bought pie crust (1 top and one bottom, let's make this easy!)
 - 1 egg beaten to wash
 - 3 tablespoons sugar to top
`.split(' - ').map(s => s.trim()).filter(s => s !== '').map(s => s.replace('- ', ''))

console.log(test);

console.log(test.map(s => parse(s, 'eng')))

export { };

