import { docs_v1 } from 'googleapis'
import { promises as fs } from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import * as yaml from 'js-yaml'
import PQueue from 'p-queue'
import { RecipeMetadata } from './config'

export interface GdocParseResult {
  markdown: string
  summary: string
  ingredients: string
  preparation: string
  imagePaths: string[]
}

export async function parseGdoc(
  doc: docs_v1.Schema$Document,
  recipeDir: string,
  auth: any,
  googleDocQueue: PQueue
): Promise<GdocParseResult> {
  let markdown = ''
  let imageCounter = 0
  const downloadedImageIds = new Set<string>()
  const imagePaths: string[] = []

  const sections = {
    summary: '',
    ingredients: '',
    preparation: '',
  }
  let currentSection: keyof typeof sections = 'summary'

  if (!doc.body?.content) return { markdown: '', ...sections, imagePaths: [] }

  // Helper function to process elements and extract images
  const processElements = async (
    elements: docs_v1.Schema$ParagraphElement[] | undefined
  ) => {
    if (!elements) return ''
    let text = ''
    for (const pe of elements) {
      if (pe.textRun && pe.textRun.content) {
        let content = pe.textRun.content
        if (pe.textRun.textStyle?.bold) content = `**${content}**`
        if (pe.textRun.textStyle?.italic) content = `*${content}*`
        text += content
      } else if (pe.inlineObjectElement?.inlineObjectId) {
        const objectId = pe.inlineObjectElement.inlineObjectId
        const image =
          doc.inlineObjects?.[objectId]?.inlineObjectProperties?.embeddedObject
        if (image?.imageProperties?.contentUri) {
          downloadedImageIds.add(objectId)
          imageCounter++
          const url = image.imageProperties.contentUri

          await googleDocQueue.add(async () => {
            const accessToken = await auth.getAccessToken()

            const controller = new AbortController()
            const timeout = setTimeout(() => {
              controller.abort()
            }, 30000)

            const res = await fetch(url, {
              headers: {
                Authorization: `Bearer ${accessToken.token}`,
              },
              signal: controller.signal,
            })

            clearTimeout(timeout)

            const contentType = res.headers.get('content-type') || 'image/jpeg'

            if (!contentType.startsWith('image/')) {
              console.warn(
                `Skipping download of non-image content: ${contentType}`
              )
              return
            }

            const buffer = await res.buffer()
            const extension = contentType.split(';')[0].split('/')[1]
            const filename = `image-${imageCounter}.${extension}`
            await fs.writeFile(path.join(recipeDir, filename), buffer)
            text += `![${doc.title} image ${imageCounter}](./${filename})`
            imagePaths.push(filename)
          })
        }
      }
    }
    return text
  }

  // Process headers
  if (doc.headers) {
    for (const headerId in doc.headers) {
      const header = doc.headers[headerId]
      if (header.content) {
        for (const element of header.content) {
          if (element.paragraph) {
            await processElements(element.paragraph.elements)
          }
        }
      }
    }
  }

  for (const element of doc.body.content) {
    if (element.paragraph) {
      const styleType = element.paragraph.paragraphStyle?.namedStyleType
      const isList = !!element.paragraph.bullet

      let line = ''
      if (element.paragraph.elements) {
        line = await processElements(element.paragraph.elements)
      }

      line = line.replace(/\n$/, '')

      if (styleType?.startsWith('HEADING')) {
        const headingText = line.toLowerCase().trim()
        if (headingText.includes('ingredient')) {
          currentSection = 'ingredients'
          continue
        } else if (
          headingText.includes('preparation') ||
          headingText.includes('instruction')
        ) {
          currentSection = 'preparation'
          continue
        } else if (headingText.includes('summary')) {
          currentSection = 'summary'
          continue
        }
      }

      let markdownLine = ''
      if (styleType === 'TITLE') {
        markdownLine += `# ${line}\n\n`
      } else if (styleType === 'HEADING_1') {
        markdownLine += `# ${line}\n\n`
      } else if (styleType === 'HEADING_2') {
        markdownLine += `## ${line}\n\n`
      } else if (styleType === 'HEADING_3') {
        markdownLine += `### ${line}\n\n`
      } else if (isList) {
        markdownLine += `* ${line}\n`
      } else if (line.trim() !== '') {
        markdownLine += `${line}\n\n`
      }

      if (markdownLine) {
        markdown += markdownLine
        sections[currentSection] += markdownLine
      }
    }
  }

  // Download any other images not referenced inline
  if (doc.inlineObjects) {
    for (const objectId in doc.inlineObjects) {
      if (downloadedImageIds.has(objectId)) continue
      const inlineObject = doc.inlineObjects[objectId]
      const image = inlineObject.inlineObjectProperties?.embeddedObject
      if (image?.imageProperties?.contentUri) {
        imageCounter++
        const url = image.imageProperties.contentUri

        await googleDocQueue.add(async () => {
          const accessToken = await auth.getAccessToken()

          const controller = new AbortController()
          const timeout = setTimeout(() => {
            controller.abort()
          }, 30000)

          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${accessToken.token}`,
            },
            signal: controller.signal,
          })

          clearTimeout(timeout)

          const contentType = res.headers.get('content-type') || 'image/jpeg'

          if (!contentType.startsWith('image/')) {
            console.warn(
              `Skipping download of non-image content: ${contentType}`
            )
            return
          }

          const buffer = await res.buffer()
          const extension = contentType.split(';')[0].split('/')[1]
          const filename = `image-${imageCounter}.${extension}`
          await fs.writeFile(path.join(recipeDir, filename), buffer)
          imagePaths.push(filename)
        })
      }
    }
  }

  if (doc.positionedObjects) {
    for (const objectId in doc.positionedObjects) {
      const positionedObject = doc.positionedObjects[objectId]
      const image = positionedObject.positionedObjectProperties?.embeddedObject
      if (image?.imageProperties?.contentUri) {
        imageCounter++
        const url = image.imageProperties.contentUri

        await googleDocQueue.add(async () => {
          const accessToken = await auth.getAccessToken()

          const controller = new AbortController()
          const timeout = setTimeout(() => {
            controller.abort()
          }, 30000)

          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${accessToken.token}`,
            },
            signal: controller.signal,
          })

          clearTimeout(timeout)

          const contentType = res.headers.get('content-type') || 'image/jpeg'

          if (!contentType.startsWith('image/')) {
            console.warn(
              `Skipping download of non-image content: ${contentType}`
            )
            return
          }

          const buffer = await res.buffer()
          const extension = contentType.split(';')[0].split('/')[1]
          const filename = `image-${imageCounter}.${extension}`
          await fs.writeFile(path.join(recipeDir, filename), buffer)
          imagePaths.push(filename)
        })
      }
    }
  }

  return { markdown, ...sections, imagePaths }
}

export function extractMetadataFromTable(doc: docs_v1.Schema$Document) {
  const metadata: Record<string, string> = {}
  if (!doc.body || !doc.body.content) {
    return metadata
  }

  const firstElement = doc.body.content[1]
  if (!firstElement || !firstElement.table || !firstElement.table.tableRows) {
    return metadata
  }

  for (const row of firstElement.table.tableRows) {
    if (row.tableCells && row.tableCells.length >= 2) {
      const key = getTextFromTableCell(row.tableCells[0]).trim().toLowerCase()
      const value = getTextFromTableCell(row.tableCells[1]).trim()
      if (key && value) {
        metadata[key] = value
      }
    }
  }
  return metadata
}

function getTextFromTableCell(cell: docs_v1.Schema$TableCell) {
  let text = ''
  if (cell.content) {
    for (const element of cell.content) {
      if (element.paragraph && element.paragraph.elements) {
        for (const pe of element.paragraph.elements) {
          text += pe.textRun ? pe.textRun.content : ''
        }
      }
    }
  }
  return text.replace(/\n/g, '')
}

export function parseYamlMetadata(
  description: string | undefined
): RecipeMetadata | undefined {
  if (!description || !description.trim()) {
    return undefined
  }

  try {
    // Try to parse the description as YAML
    const metadata = yaml.load(description.trim()) as RecipeMetadata
    return metadata
  } catch (error) {
    console.warn(`Failed to parse YAML metadata from description: ${error}`)
    return undefined
  }
}
