import { FC, useState, useMemo, Fragment } from 'react'
import Fraction from 'fraction.js'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Transition,
} from '@headlessui/react'

interface ServingsSelectorProps {
  servings: string
  setServings: (servings: string) => void
  originalServings: number
}

const ServingsSelector: FC<ServingsSelectorProps> = ({
  servings,
  setServings,
  originalServings,
}) => {
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

  return (
    <div data-testid="ingredients-container" className="my-4">
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
          data-testid="servings-input"
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
  )
}

export default ServingsSelector

