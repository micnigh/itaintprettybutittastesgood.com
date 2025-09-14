import { FC, useState, useMemo, Fragment, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import recipes from '../recipes.json'
import { slugify } from '../utils'
import type { Recipe } from '../../scripts/fetch-data/config'
import { format } from 'date-fns'
import Fraction from 'fraction.js'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Transition,
} from '@headlessui/react'

const parseQuantity = (
  quantity: string | null | undefined
): Fraction | null => {
  if (!quantity) return null
  let processedQuantity = quantity.trim()
  try {
    const unicodeFractions: { [key: string]: string } = {
      '¼': '1/4',
      '½': '1/2',
      '¾': '3/4',
      '⅐': '1/7',
      '⅑': '1/9',
      '⅒': '1/10',
      '⅓': '1/3',
      '⅔': '2/3',
      '⅕': '1/5',
      '⅖': '2/5',
      '⅗': '3/5',
      '⅘': '4/5',
      '⅙': '1/6',
      '⅚': '5/6',
      '⅛': '1/8',
      '⅜': '3/8',
      '⅝': '5/8',
      '⅞': '7/8',
    }

    for (const [uni, asc] of Object.entries(unicodeFractions)) {
      processedQuantity = processedQuantity.replace(uni, asc)
    }

    if (processedQuantity.includes('-')) {
      processedQuantity = processedQuantity.split('-')[0].trim()
    }

    return new Fraction(processedQuantity)
  } catch {
    return null
  }
}

const formatQuantity = (quantity: Fraction | null): string => {
  if (!quantity) return ''
  return quantity.toFraction(true)
}

const autoConvertUnits = (
  quantity: Fraction,
  unit: string | null
): { quantity: Fraction; unit: string | null } => {
  if (!unit) return { quantity, unit }

  let currentQuantity = quantity
  let currentUnit = unit.toLowerCase().replace(/s$/, '')

  if (currentUnit === 'cup') {
    if (currentQuantity.valueOf() < 0.25) {
      currentQuantity = currentQuantity.mul(16)
      currentUnit = 'tablespoon'
    }
  }

  if (currentUnit === 'tablespoon') {
    if (currentQuantity.valueOf() < 1) {
      currentQuantity = currentQuantity.mul(3)
      currentUnit = 'teaspoon'
    }
  }

  const finalUnit =
    currentQuantity.valueOf() > 1 ? `${currentUnit}s` : currentUnit

  return { quantity: currentQuantity, unit: finalUnit }
}

const Recipe: FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { slug } = useParams<{ slug: string }>()
  const recipe = (recipes as Recipe[]).find((r) => slugify(r.title) === slug)

  const originalServings = useMemo(() => {
    if (recipe?.metadata?.servings) {
      const match = recipe.metadata.servings.match(/(\d+)/)
      return match ? parseInt(match[1], 10) : 1
    }
    return 1
  }, [recipe])

  const [servings, setServings] = useState<string>(originalServings.toString())
  const [query, setQuery] = useState('')

  const servingOptions = useMemo(() => {
    const multipliers = [0.25, 0.5, 0.75, 1, 2, 4]
    const uniqueOptions = new Map<
      string,
      { value: string; multiplier: number }
    >()
    multipliers.forEach((m) => {
      const val = originalServings * m
      const optionValue = new Fraction(val).toFraction(true)
      if (!uniqueOptions.has(optionValue)) {
        uniqueOptions.set(optionValue, {
          value: optionValue,
          multiplier: m,
        })
      }
    })
    return Array.from(uniqueOptions.values())
  }, [originalServings])

  const filteredOptions =
    query === ''
      ? servingOptions
      : servingOptions.filter((option) =>
          option.value
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  if (!recipe) {
    return <div>Recipe not found</div>
  }

  const servingsFraction =
    parseQuantity(servings) || new Fraction(originalServings)

  return (
    <>
      <div className="flex flex-row items-baseline space-x-2">
        <span className="w-max">
          <h1 className="text-3xl font-bold mt-4 sm:mt-6 mr-4">
            {recipe.title}
          </h1>
          {recipe.metadata?.date && (
            <div className="text-sm text-gray-500 mb-4">
              {format(new Date(recipe.metadata?.date || ''), 'MMM d, yyyy')}
            </div>
          )}
        </span>
        {recipe.metadata?.tags && (
          <span className="flex-grow min-w-48">
            {recipe.metadata?.tags?.map((tag) => (
              <span
                key={tag}
                className="bg-blue-400 text-white whitespace-nowrap rounded-full px-2 py-0.5 text-sm mr-4 mb-4 inline-block"
              >
                {tag}
              </span>
            ))}
          </span>
        )}
      </div>
      <ul className="flex flex-row gap-4 mb-2">
        {recipe.metadata?.level && <li>Level: {recipe.metadata?.level}</li>}
        {recipe.metadata?.prep && <li>Prep: {recipe.metadata?.prep}</li>}
        {recipe.metadata?.cook && <li>Cook: {recipe.metadata?.cook}</li>}
        {recipe.metadata?.servings && <li>Servings: {originalServings}</li>}
      </ul>

      <article className="prose max-w-none prose-img:rounded-xl">
        {recipe.heroImage && (
          <img
            src={`/recipes/${slug}/${recipe.heroImage}`}
            alt={recipe.title}
            className="rounded-lg inline-block float-right w-full h-full sm:max-w-[500px] sm:max-h-[500px] ml-8 my-8"
          />
        )}

        {recipe.summary && (
          <ReactMarkdown>{`### Summary\n${recipe.summary}`}</ReactMarkdown>
        )}

        <h3>Ingredients</h3>
        <div className="my-4">
          <label
            htmlFor="servings-input"
            className="inline-block mr-4 text-sm font-medium text-gray-700"
          >
            Adjust Servings:{' '}
          </label>
          <Combobox
            as="div"
            className="relative inline-block"
            value={servings}
            onChange={(value) => setServings(value || '')}
          >
            <ComboboxInput
              id="servings-input"
              className="mt-1 inline-block w-24 rounded-md border-black shadow focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={(event) => {
                setQuery(event.target.value)
                setServings(event.target.value)
              }}
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
              <span className="text-gray-400">▼</span>
            </ComboboxButton>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
            >
              <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredOptions.map((option) => (
                  <ComboboxOption
                    key={option.value}
                    value={option.value}
                    className="group relative cursor-default select-none py-2 pl-4 pr-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                  >
                    <>
                      <span
                        className={
                          option.multiplier === 1 ? 'font-bold' : 'font-normal'
                        }
                      >
                        {option.value}
                      </span>
                      {option.multiplier !== 1 && (
                        <span className="ml-2 text-gray-500 group-data-[focus]:text-indigo-200">
                          ({new Fraction(option.multiplier).toFraction(true)}
                          x)
                        </span>
                      )}
                    </>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </Transition>
          </Combobox>
        </div>
        <ul>
          {recipe.ingredients?.map((ingredient) => {
            const originalQuantity = parseQuantity(ingredient.quantity)
            let scaledQuantityStr = ingredient.quantity || ''
            let displayUnit = ingredient.unit
            if (originalQuantity) {
              const multiplier = servingsFraction.valueOf() / originalServings
              const scaledQuantity = originalQuantity.mul(multiplier)
              const converted = autoConvertUnits(
                scaledQuantity,
                ingredient.unit
              )
              scaledQuantityStr = formatQuantity(converted.quantity)
              displayUnit = converted.unit
            }
            return (
              <li key={ingredient.name}>
                {scaledQuantityStr} {displayUnit} {ingredient.name}
              </li>
            )
          })}
        </ul>

        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {`### Preparation\n${recipe.preparation || ''}`}
        </ReactMarkdown>
      </article>
    </>
  )
}

export default Recipe
