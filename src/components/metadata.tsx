import React from "react"
import { GiCook, GiCampCookingPot, GiLevelEndFlag } from "react-icons/gi"
import { BiCookie } from "react-icons/bi"
import { Themed } from "@theme-ui/mdx"

export const Metadata = ({ prep, cook, servings, level }) => {
  return (
    <div sx={{
      flexDirection: 'row',
      display: 'flex',
      "& > *": {
        flexGrow: 1,
        "& > *": {
          mr: 1,
          fontSize: 0,
          whiteSpace: 'nowrap'
        }
      }
    }}>
      {/* <Themed.h3></Themed.h3> */}
      <div>
        <GiCook /><span>Prep: {prep}</span>
      </div>
      <div>
        <GiCampCookingPot /><span>Cook: {cook}</span>
      </div>
      <div>
        <BiCookie /><span>Servings: {servings}</span>
      </div>
      <div>
        <GiLevelEndFlag /><span>Level: {level}</span>
      </div>
    </div>
  )
}
