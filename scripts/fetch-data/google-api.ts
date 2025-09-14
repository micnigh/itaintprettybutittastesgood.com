import { google, drive_v3, docs_v1 } from 'googleapis'
import { promises as fs } from 'fs'
import { Credentials } from './config'

async function authorize(credentialsPath: string) {
  const content = await fs.readFile(credentialsPath, 'utf-8')
  const keys: Credentials = JSON.parse(content)

  console.log('Attempting to authorize with email:', keys.client_email)
  console.log('Private key starts with:', keys.private_key.substring(0, 40))

  // The private_key in the JSON file can have extra backslashes.
  // This will remove them.
  const private_key = keys.private_key.replace(/\\n/g, '\n')

  const client = new google.auth.JWT({
    email: keys.client_email,
    key: private_key,
    scopes: [
      'https://www.googleapis.com/auth/documents.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
    ],
  })
  await client.authorize()
  return client
}

async function listDocsRecursive(
  auth: any,
  folderId: string
): Promise<drive_v3.Schema$File[]> {
  const drive = google.drive({ version: 'v3', auth })
  const docs: drive_v3.Schema$File[] = []

  async function traverse(currentFolderId: string): Promise<void> {
    const res = await drive.files.list({
      q: `'${currentFolderId}' in parents`,
      fields: 'files(id, name, mimeType, modifiedTime, description)',
    })
    const files = res.data.files

    if (files) {
      for (const file of files) {
        if (file.mimeType === 'application/vnd.google-apps.document') {
          docs.push(file)
        } else if (
          file.mimeType === 'application/vnd.google-apps.folder' &&
          file.id
        ) {
          await traverse(file.id) // Recurse into subfolder
        }
      }
    }
  }

  await traverse(folderId)
  return docs
}

async function fetchDoc(
  auth: any,
  docId: string
): Promise<docs_v1.Schema$Document> {
  const docs = google.docs({ version: 'v1', auth })
  const res = await docs.documents.get({
    documentId: docId,
  })
  return res.data
}

export { authorize, listDocsRecursive, fetchDoc }
