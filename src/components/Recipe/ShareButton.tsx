import { FC, useState, Fragment } from 'react'
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react'
import { Tooltip } from 'react-tooltip'

interface ShareButtonProps {
  recipeTitle: string
}

const ShareButton: FC<ShareButtonProps> = ({ recipeTitle }) => {
  const [copied, setCopied] = useState(false)

  const getRecipeUrl = () => {
    return window.location.origin + window.location.pathname
  }

  const handleCopyLink = async () => {
    const url = getRecipeUrl()
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleShare = (type: 'facebook' | 'instagram' | 'email' | 'copy') => {
    const recipeUrl = getRecipeUrl()
    const url = encodeURIComponent(recipeUrl)
    const title = encodeURIComponent(recipeTitle)

    switch (type) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          '_blank',
          'width=600,height=400'
        )
        break
      case 'instagram':
        handleCopyLink()
        break
      case 'email':
        window.location.href = `mailto:?subject=${title}&body=${encodeURIComponent(recipeUrl)}`
        break
      case 'copy':
        handleCopyLink()
        break
    }
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
        data-tooltip-id="share-tooltip"
        data-tooltip-content="Share"
      >
        <span className="sr-only">Share recipe</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M6 22q-.825 0-1.412-.587T4 20V10q0-.825.588-1.412T6 8h3v2H6v10h12V10h-3V8h3q.825 0 1.413.588T20 10v10q0 .825-.587 1.413T18 22zm5-6V4.825l-1.6 1.6L8 5l4-4l4 4l-1.4 1.425l-1.6-1.6V16z" />
        </svg>
      </MenuButton>
      <Tooltip id="share-tooltip" />

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => handleShare('facebook')}
                  className={`${
                    focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } group flex w-full items-center px-4 py-2 text-sm`}
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => handleShare('instagram')}
                  className={`${
                    focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } group flex w-full items-center px-4 py-2 text-sm`}
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => handleShare('email')}
                  className={`${
                    focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } group flex w-full items-center px-4 py-2 text-sm`}
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => handleShare('copy')}
                  className={`${
                    focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } group flex w-full items-center px-4 py-2 text-sm`}
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}

export default ShareButton

