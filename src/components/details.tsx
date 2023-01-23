import React from "react"
/** @jsx jsx */
import {jsx} from "theme-ui"

export const Details = ({label, children}) => {
  return (
    <details>
      <summary>{label}</summary>
      {children}
    </details>
  )
}
