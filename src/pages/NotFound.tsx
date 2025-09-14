import { FC } from 'react'

const NotFound: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <img
        src="/404-not-found.png"
        alt="404 Not Found"
        className="w-1/2 h-auto"
      />
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg">Page not found</p>
    </div>
  )
}

export default NotFound
