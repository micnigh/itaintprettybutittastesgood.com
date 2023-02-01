import React, { useState } from 'react'
import { Label, Input, Checkbox } from 'theme-ui'

const localStorage = typeof window !== 'undefined' ? window.localStorage : { getItem: () => null, setItem: () => null }

const getKey = key => `itaintprettybutittastesgood.com/${key}`
export const isEditMode = () => localStorage.getItem(getKey('edit-mode')) === 'true'
export const getGithubToken = () => localStorage.getItem(getKey('github-token'))

export const PageAdmin = () => {
  const [displayGithubToken, setDisplayGithubToken] = useState(false)
  return (
    <div sx={{}}>
      <h2 sx={{ variant: 'styles.h2' }}>Admin</h2>

      <div sx={{
        mt: 3,
      }}>
        <Label sx={{ mb: 2 }}>
          <Checkbox sx={{ mr: 0 }} defaultChecked={localStorage.getItem(getKey('edit-mode')) === 'true'} onChange={e => localStorage.setItem(getKey('edit-mode'), JSON.stringify(e.target.checked))} />Edit Mode
        </Label>
        <span sx={{ mb: 2 }}>
          <Label htmlFor='github-token' sx={{ fontWeight: 'bold' }}>Github token</Label>
          <span sx={{ display: 'flex' }}>
            <Input name='github-token' sx={{
              fontSize: 1,
              pt: 1,
              flexGrow: 1,
            }} type={displayGithubToken ? 'text' : 'password'} onChange={e => {
              localStorage.setItem(getKey('github-token'), e.target.value)
            }} defaultValue={localStorage.getItem(getKey('github-token'))} />
            <Label sx={{ flexGrow: 0, width: 'auto', fontSize: 3, alignItems: 'center' }}>
              <Checkbox checked={displayGithubToken} onChange={e => setDisplayGithubToken(!displayGithubToken)} sx={{ mr: 0, ml: 1 }} />Show
            </Label>
          </span>
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
