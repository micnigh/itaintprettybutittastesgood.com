import { FC, useState, useEffect } from 'react'
import { Tooltip } from 'react-tooltip'
import PrintModal from './PrintModal'

const PrintButton: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleAfterPrint = () => {
      // Clean up: remove all print-hide attributes after printing
      const elements = document.querySelectorAll('[data-print-hide]')
      elements.forEach((el) => {
        el.removeAttribute('data-print-hide')
      })
    }

    window.addEventListener('afterprint', handleAfterPrint)
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint)
    }
  }, [])

  const handlePrint = () => {
    setIsModalOpen(true)
  }

  const handlePrintConfirm = (options: {
    includeSummary: boolean
    includeImage: boolean
  }) => {
    // Apply data-print-hide attributes based on user selections
    const summaryElements = document.querySelectorAll('[data-print-section="summary"]')
    const imageElements = document.querySelectorAll('[data-print-section="image"]')

    if (!options.includeSummary) {
      summaryElements.forEach((el) => {
        el.setAttribute('data-print-hide', 'true')
      })
    }

    if (!options.includeImage) {
      imageElements.forEach((el) => {
        el.setAttribute('data-print-hide', 'true')
      })
    }

    // Small delay to ensure DOM updates, then print
    setTimeout(() => {
      window.print()
    }, 100)
  }

  return (
    <>
      <button
        onClick={handlePrint}
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
        aria-label="Print recipe"
        data-tooltip-id="print-tooltip"
        data-tooltip-content="Print"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M18 7H6V3h12zm0 5.5q.425 0 .713-.288T19 11.5t-.288-.712T18 10.5t-.712.288T17 11.5t.288.713t.712.287M16 19v-4H8v4zm2 2H6v-4H2v-6q0-1.275.875-2.137T5 8h14q1.275 0 2.138.863T22 11v6h-4z" />
        </svg>
      </button>
      <Tooltip id="print-tooltip" />
      <PrintModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPrint={handlePrintConfirm}
      />
    </>
  )
}

export default PrintButton

