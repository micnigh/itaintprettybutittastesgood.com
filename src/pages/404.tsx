import {Link} from "gatsby"
import React from "react"
/** @jsx jsx */
import {jsx} from "theme-ui"

const Page404 = () => {
  return (
    <main>
      <Link to="/">
        <button>{"Home"}</button>
      </Link>
      <h1>{"404"}</h1>
    </main>
  )
}

export default Page404
