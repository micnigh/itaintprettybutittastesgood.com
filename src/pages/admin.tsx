import React from 'react'
import { Label, Input, Checkbox } from 'theme-ui'

const localStorage = typeof window !== 'undefined' ? window.localStorage : { getItem: () => null, setItem: () => null }

const getKey = key => `itaintprettybutittastesgood.com/${key}`
export const isEditMode = () => localStorage.getItem(getKey('edit-mode')) === 'true'
export const getGithubToken = () => localStorage.getItem(getKey('github-token'))

export const PageAdmin = () => {
  return (
    <div sx={{}}>
      <h2 sx={{ variant: 'styles.h2' }}>Admin</h2>

      <div sx={{
        mt: 3,
        '& > *': {
          mb: 3,
        }
      }}>
        <Label>
          <Checkbox defaultChecked={localStorage.getItem(getKey('edit-mode')) === 'true'} onChange={e => localStorage.setItem(getKey('edit-mode'), JSON.stringify(e.target.checked))} />Edit Mode
        </Label>
        <span>
          <Label htmlFor='github-token' sx={{ fontWeight: 'bold' }}>Github token</Label>
          <Input name='github-token' sx={{
            fontSize: 1,
            pt: 1,
          }} type='text' onChange={e => {
            localStorage.setItem(getKey('github-token'), e.target.value)
          }} defaultValue={localStorage.getItem(getKey('github-token'))} />
        </span>
      </div>
    </div>
  )
}

export default PageAdmin

export const Head = () => {
  return <>
    <meta name='robots' content='noindex,nofollow' />
    <title>itaintprettybutittastesgood - admin</title>
  </>
}
