import { google, docs_v1, drive_v3 } from 'googleapis';
import { promises as fs } from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';
import * as yaml from 'js-yaml';
import 'dotenv/config';

// 1. Follow this guide to create a service account and credentials:
//    https://developers.google.com/workspace/guides/create-credentials
// 2. Enable the Google Docs API and Google Drive API for your project.
// 3. Share your Google Drive folder with the service account's email address.
// 4. Create a `credentials.json` file in the root of your project with the
//    downloaded credentials.
// 5. Add the ID of your Google Drive folder to the `FOLDER_ID` variable below.
//    You can get this from the URL of the folder (e.g., .../folders/THIS_IS_THE_ID).
//
// 6. Create a `.env` file in the root of your project.
// 7. Add your Gemini API key to the `.env` file like this:
//    GEMINI_API_KEY="YOUR_API_KEY_HERE"
//    Get your key from Google AI Studio: https://makersuite.google.com/app/apikey

const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const FOLDER_ID = '1Karp6fSxF4ZkO9A8Og585LZ_PP-LS2_n'; // <-- ADD YOUR FOLDER ID HERE
const CACHE_DIR = path.join(process.cwd(), 'cache/google-docs');
const RECIPES_DIR = path.join(process.cwd(), 'public/recipes');

interface Credentials {
    client_email: string;
    private_key: string;
}

interface Ingredient {
    name: string;
    quantity: string | null;
    unit: string | null;
}

export interface Recipe {
    id: string;
    slug: string;
    title: string;
    ingredients: Ingredient[];
    markdown: string;
    metadata?: RecipeMetadata;
    heroImage?: string;
}

export interface RecipeMetadata {
    date: string;
    prep: string;
    cook: string;
    servings: string;
    level: string;
    tags: string[];
}

interface CachedDoc extends docs_v1.Schema$Document {
    modifiedTime: string;
}

async function authorize() {
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
  const keys: Credentials = JSON.parse(content);

  console.log('Attempting to authorize with email:', keys.client_email);
  console.log('Private key starts with:', keys.private_key.substring(0, 40));

  // The private_key in the JSON file can have extra backslashes.
  // This will remove them.
  const private_key = keys.private_key.replace(/\\n/g, '\n');

  const client = new google.auth.JWT({
    email: keys.client_email,
    key: private_key,
    scopes: [
      'https://www.googleapis.com/auth/documents.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
    ]
  });
  await client.authorize();
  return client;
}

async function listDocsRecursive(auth: any, folderId: string): Promise<drive_v3.Schema$File[]> {
  const drive = google.drive({ version: 'v3', auth });
  const docs: drive_v3.Schema$File[] = [];
  
  async function traverse(currentFolderId: string): Promise<void> {
    const res = await drive.files.list({
      q: `'${currentFolderId}' in parents`,
      fields: 'files(id, name, mimeType, modifiedTime, description)',
    });
    const files = res.data.files;
    

    if (files) {
        for (const file of files) {
          if (file.mimeType === 'application/vnd.google-apps.document') {
            docs.push(file);
          } else if (file.mimeType === 'application/vnd.google-apps.folder' && file.id) {
            await traverse(file.id); // Recurse into subfolder
          }
        }
    }
  }

  await traverse(folderId);
  return docs;
}

async function fetchDoc(auth: any, docId: string): Promise<docs_v1.Schema$Document> {
  const docs = google.docs({ version: 'v1', auth });
  const res = await docs.documents.get({
    documentId: docId,
  });
  return res.data;
}

function slugify(text: string): string {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

interface GdocParseResult {
    markdown: string;
    imagePaths: string[];
}

async function parseGdoc(doc: docs_v1.Schema$Document, recipeDir: string, auth: any): Promise<GdocParseResult> {
  let markdown = '';
  let imageCounter = 0;
  const downloadedImageIds = new Set<string>();
  const imagePaths: string[] = [];

  if (!doc.body?.content) return { markdown: '', imagePaths: [] };

  // Helper function to process elements and extract images
  const processElements = async (elements: docs_v1.Schema$ParagraphElement[] | undefined) => {
      if (!elements) return '';
      let text = '';
      for (const pe of elements) {
          if (pe.textRun && pe.textRun.content) {
              let content = pe.textRun.content;
              if (pe.textRun.textStyle?.bold) content = `**${content}**`;
              if (pe.textRun.textStyle?.italic) content = `*${content}*`;
              text += content;
          } else if (pe.inlineObjectElement?.inlineObjectId) {
              const objectId = pe.inlineObjectElement.inlineObjectId;
              const image = doc.inlineObjects?.[objectId]?.inlineObjectProperties?.embeddedObject;
              if (image?.imageProperties?.contentUri) {
                  downloadedImageIds.add(objectId);
                  imageCounter++;
                  const url = image.imageProperties.contentUri;
                  
                  const accessToken = await auth.getAccessToken();
                  const res = await fetch(url, {
                      headers: {
                          'Authorization': `Bearer ${accessToken.token}`
                      }
                  });

                  const contentType = res.headers.get('content-type') || 'image/jpeg';
                  
                  if (!contentType.startsWith('image/')) {
                      console.warn(`Skipping download of non-image content: ${contentType}`);
                      return text;
                  }

                  const buffer = await res.buffer();
                  const extension = contentType.split(';')[0].split('/')[1];
                  const filename = `image-${imageCounter}.${extension}`;
                  await fs.writeFile(path.join(recipeDir, filename), buffer);
                  text += `![${doc.title} image ${imageCounter}](./${filename})`;
                  imagePaths.push(filename);
              }
          }
      }
      return text;
  };

  // Process headers
  if (doc.headers) {
    for (const headerId in doc.headers) {
        const header = doc.headers[headerId];
        if (header.content) {
            for (const element of header.content) {
                if (element.paragraph) {
                    await processElements(element.paragraph.elements);
                }
            }
        }
    }
  }

  for (const element of doc.body.content) {
    if (element.paragraph) {
      const styleType = element.paragraph.paragraphStyle?.namedStyleType;
      const isList = !!element.paragraph.bullet;

      let line = '';
      if (element.paragraph.elements) {
        line = await processElements(element.paragraph.elements);
      }
      
      line = line.replace(/\n$/, '');

      if (styleType === 'TITLE') {
        markdown += `# ${line}\n\n`;
      } else if (styleType === 'HEADING_1') {
        markdown += `# ${line}\n\n`;
      } else if (styleType === 'HEADING_2') {
        markdown += `## ${line}\n\n`;
      } else if (styleType === 'HEADING_3') {
        markdown += `### ${line}\n\n`;
      } else if (isList) {
        markdown += `* ${line}\n`;
      } else if (line.trim() !== '') {
        markdown += `${line}\n\n`;
      }
    }
  }

  // Download any other images not referenced inline
  if (doc.inlineObjects) {
    for (const objectId in doc.inlineObjects) {
        if (downloadedImageIds.has(objectId)) continue;
        const inlineObject = doc.inlineObjects[objectId];
        const image = inlineObject.inlineObjectProperties?.embeddedObject;
        if (image?.imageProperties?.contentUri) {
            imageCounter++;
            const url = image.imageProperties.contentUri;
            
            const accessToken = await auth.getAccessToken();
            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken.token}`
                }
            });

            const contentType = res.headers.get('content-type') || 'image/jpeg';

            if (!contentType.startsWith('image/')) {
                console.warn(`Skipping download of non-image content: ${contentType}`);
                continue;
            }

            const buffer = await res.buffer();
            const extension = contentType.split(';')[0].split('/')[1];
            const filename = `image-${imageCounter}.${extension}`;
            await fs.writeFile(path.join(recipeDir, filename), buffer);
            imagePaths.push(filename);
        }
    }
  }
  
  if (doc.positionedObjects) {
      for (const objectId in doc.positionedObjects) {
          const positionedObject = doc.positionedObjects[objectId];
          const image = positionedObject.positionedObjectProperties?.embeddedObject;
           if (image?.imageProperties?.contentUri) {
              imageCounter++;
              const url = image.imageProperties.contentUri;

              const accessToken = await auth.getAccessToken();
              const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken.token}`
                }
              });

              const contentType = res.headers.get('content-type') || 'image/jpeg';

              if (!contentType.startsWith('image/')) {
                console.warn(`Skipping download of non-image content: ${contentType}`);
                continue;
              }

              const buffer = await res.buffer();
              const extension = contentType.split(';')[0].split('/')[1];
              const filename = `image-${imageCounter}.${extension}`;
              await fs.writeFile(path.join(recipeDir, filename), buffer);
              imagePaths.push(filename);
          }
      }
  }

  return { markdown, imagePaths };
}

async function getIngredientsWithGemini(markdownContent: string): Promise<Ingredient[]> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in the .env file.");
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});

  const prompt = `
    Analyze the following recipe text and extract the ingredients.
    Return the ingredients as a JSON array, where each object has "name", "quantity", and "unit".
    If a quantity or unit is not specified, set it to null.
    For example: "2 cups of flour" should be { "name": "flour", "quantity": "2", "unit": "cups" }.
    "a pinch of salt" should be { "name": "salt", "quantity": "a pinch", "unit": null }.
    "1 egg" should be { "name": "egg", "quantity": "1", "unit": null }.
    
    Here is the recipe:
    ---
    ${markdownContent}
    ---
    
    Return only the JSON array.
  `;
  
  const MAX_RETRIES = 5;
  let attempt = 0;
  let delay = 1000; // start with 1 second

  while (attempt < MAX_RETRIES) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean the response to ensure it's valid JSON.
        // The model often wraps the JSON in Markdown fences (```json ... ```).
        const startIndex = text.indexOf('[');
        const endIndex = text.lastIndexOf(']');

        if (startIndex === -1 || endIndex === -1) {
          console.error("Error: Could not find a valid JSON array in the Gemini response for the document.");
          console.error("Response text:", text);
          return [];
        }

        const jsonString = text.substring(startIndex, endIndex + 1);
        return JSON.parse(jsonString);
      } catch (error: any) {
        if (error.status === 503 && attempt < MAX_RETRIES - 1) {
            console.warn(`Gemini API returned 503. Retrying in ${delay / 1000}s... (Attempt ${attempt + 1}/${MAX_RETRIES})`);
            await new Promise(res => setTimeout(res, delay));
            delay *= 2; // Exponential backoff
            attempt++;
        } else {
            console.error("Error calling Gemini API or parsing its response:", error);
            return []; // Return an empty array on non-retriable error or after max retries
        }
      }
  }
  return []; // Should not be reached if MAX_RETRIES > 0
}


function extractMetadataFromTable(doc: docs_v1.Schema$Document) {
  const metadata: Record<string, string> = {};
  if (!doc.body || !doc.body.content) {
    return metadata;
  }

  const firstElement = doc.body.content[1];
  if (
    !firstElement ||
    !firstElement.table ||
    !firstElement.table.tableRows
  ) {
    return metadata;
  }

  for (const row of firstElement.table.tableRows) {
    if (row.tableCells && row.tableCells.length >= 2) {
      const key = getTextFromTableCell(row.tableCells[0]).trim().toLowerCase();
      const value = getTextFromTableCell(row.tableCells[1]).trim();
      if (key && value) {
        metadata[key] = value;
      }
    }
  }
  return metadata;
}

function getTextFromTableCell(cell: docs_v1.Schema$TableCell) {
  let text = '';
  if (cell.content) {
    for (const element of cell.content) {
      if (element.paragraph && element.paragraph.elements) {
        for (const pe of element.paragraph.elements) {
          text += pe.textRun ? pe.textRun.content : '';
        }
      }
    }
  }
  return text.replace(/\n/g, '');
}

function parseYamlMetadata(description: string | undefined): Record<string, any> | undefined {
  if (!description || !description.trim()) {
    return undefined;
  }

  try {
    // Try to parse the description as YAML
    const metadata = yaml.load(description.trim()) as Record<string, any>;
    return metadata;
  } catch (error) {
    console.warn(`Failed to parse YAML metadata from description: ${error}`);
    return undefined;
  }
}

async function processDoc(file: drive_v3.Schema$File, auth: any) {
  const slug = slugify(file.name || '');
  const recipeDir = path.join(RECIPES_DIR, slug);
  await fs.mkdir(recipeDir, { recursive: true });

  const cachePath = path.join(CACHE_DIR, `${slug}.json`);
  const recipePath = path.join(recipeDir, `index.json`);
  
  // Stage 1: Fetch from Google Docs API only if modification time has changed
  let doc: docs_v1.Schema$Document | undefined;
  try {
    const cachedData = await fs.readFile(cachePath, 'utf-8');
    const cachedDoc: CachedDoc = JSON.parse(cachedData);
    
    if (file.modifiedTime !== cachedDoc.modifiedTime) {
      console.log(`[FETCH] Modification change detected, re-fetching: ${file.name}`);
      doc = await fetchDoc(auth, file.id!);
      // Add modifiedTime to the document for caching
      const docWithModifiedTime = { ...doc, modifiedTime: file.modifiedTime! };
      await fs.writeFile(cachePath, JSON.stringify(docWithModifiedTime, null, 2));
      doc = docWithModifiedTime as docs_v1.Schema$Document;
    } else {
      // console.log(`[FETCH] Using raw cache for: ${file.name}`);
    }
  } catch (error) { // Not in raw cache
    console.log(`[FETCH] Not in cache, fetching: ${file.name}`);
    doc = await fetchDoc(auth, file.id!);
    // Add modifiedTime to the document for caching
    const docWithModifiedTime = { ...doc, modifiedTime: file.modifiedTime! };
    await fs.writeFile(cachePath, JSON.stringify(docWithModifiedTime, null, 2));
    doc = docWithModifiedTime as docs_v1.Schema$Document;
  }
  
  // Stage 2: Process with Gemini only if necessary
  let shouldProcess = false;
  try {
      const recipeStat = await fs.stat(recipePath);
      const cacheStat = await fs.stat(cachePath);
      if (cacheStat.mtime > recipeStat.mtime) {
          console.log(`[PROCESS] Raw data updated, re-processing: ${file.name}`);
          shouldProcess = true;
      } else {
          // console.log(`[PROCESS] Skipping up-to-date recipe: ${file.name}`);
      }
  } catch (error) { // Not in processed recipe cache
      console.log(`[PROCESS] New recipe, processing: ${file.name}`);
      shouldProcess = true;
  }

  if (shouldProcess) {
      if (!doc) {
          const cachedData = await fs.readFile(cachePath, 'utf-8');
          doc = JSON.parse(cachedData);
      }
      const { markdown, imagePaths } = await parseGdoc(doc as docs_v1.Schema$Document, recipeDir, auth);
      const ingredients = await getIngredientsWithGemini(markdown);
      const metadata = parseYamlMetadata(file.description || '');

      const recipe: Recipe = {
        id: doc?.documentId!,
        slug: slug,
        title: doc?.title!,
        ingredients,
        markdown,
        metadata,
      };

      if (imagePaths.length === 1) {
          recipe.heroImage = imagePaths[0];
      }
      
      await fs.writeFile(recipePath, JSON.stringify(recipe, null, 2));
  }
}

async function main() {
  const noCache = process.argv.includes('--no-cache');

  if (noCache) {
    console.log('`--no-cache` flag detected. Cleaning cache directories...');
    // Clean up cache directories for a fresh run
    await fs.rm(CACHE_DIR, { recursive: true, force: true });
    await fs.rm(RECIPES_DIR, { recursive: true, force: true });
  }

  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.mkdir(RECIPES_DIR, { recursive: true });

  if (FOLDER_ID === 'your-folder-id-here' as any) {
    console.log('No folder ID provided. Please update `scripts/fetch-data.js`.');
    return;
  }

  try {
    await fs.access(CREDENTIALS_PATH);
  } catch (error) {
    console.error('Error: `credentials.json` not found.');
    console.error('Please follow the setup instructions in `scripts/fetch-data.js`.');
    return;
  }

  const auth = await authorize();
  const docFiles = await listDocsRecursive(auth, FOLDER_ID);

  if (!docFiles || docFiles.length === 0) {
    console.log('No Google Docs found in the specified folder or its subfolders.');
    return;
  }
  
  console.log(`Found ${docFiles.length} documents. Processing with modification-time-based cache...`);
  
  const BATCH_SIZE = 10;
  for (let i = 0; i < docFiles.length; i += BATCH_SIZE) {
    const batch = docFiles.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${i / BATCH_SIZE + 1}...`);
    const processingPromises = batch.map(file => processDoc(file, auth));
    await Promise.all(processingPromises);
  }
  
  // Combine all recipes into a single file for the app
  const allRecipes: Recipe[] = [];
  const recipeDirs = await fs.readdir(RECIPES_DIR, { withFileTypes: true });
  for (const recipeDir of recipeDirs) {
    if (recipeDir.isDirectory()) {
        const content = await fs.readFile(path.join(RECIPES_DIR, recipeDir.name, 'index.json'), 'utf-8');
        allRecipes.push(JSON.parse(content));
    }
  }
  
  const finalOutputPath = path.join(process.cwd(), 'src', 'recipes.json');
  await fs.writeFile(finalOutputPath, JSON.stringify(allRecipes, null, 2));

  console.log(`Successfully processed ${docFiles.length} recipes.`);
}

main().catch(console.error);
