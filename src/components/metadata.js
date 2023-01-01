import React from "react"
import { GiCook, GiCampCookingPot, GiLevelEndFlag } from "react-icons/gi"
import { BiCookie } from "react-icons/bi"

export const Metadata = ({ prep, cook, servings, level }) => {
  return (
    <div>
      <div><GiCook />Prep: {prep}</div>
      <div><GiCampCookingPot /> Cook: {cook}</div>
      <div><BiCookie /> Servings: {servings}</div>
      <div><GiLevelEndFlag /> Level: {level}</div>
    </div>
  )
}
