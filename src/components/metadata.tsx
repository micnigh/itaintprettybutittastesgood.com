import React from "react"
import { GiCook, GiCampCookingPot, GiLevelEndFlag } from "react-icons/gi"
import { BiCookie } from "react-icons/bi"
/** @jsx jsx */
import {jsx} from "theme-ui"

export const Metadata = ({ prep, cook, servings, level }) => {
  return (
    <div sx={{
      display: 'flex',
      alignItems: 'center',
      justifyItems: 'center',
      textAlign: 'center',
      "& > *": {
        flexGrow: 1,
        "& > *": {
          mr: 1,
          fontSize: '1.25rem',
          lineHeight: '1.25rem',
          alignContent: 'center',
        }
      }
    }}>
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
