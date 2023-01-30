// import { compile } from '@mdx-js/mdx'
// import { CreateNodeArgs, CreateSchemaCustomizationArgs } from "gatsby"

// export const onCreateNode = async ({ node, actions }: CreateNodeArgs) => {
//   const { createNodeField } = actions
//   if (node.internal.type === `GoogleDocs`) {
//     createNodeField({
//       node,
//       name: `body`,
//       value: String(await compile(node.markdown as string))
//     })
//   }
// }

// export const createSchemaCustomization = async ({ actions }: CreateSchemaCustomizationArgs) => {
//   const { createTypes,  } = actions

//   createTypes(`#graphql
//     type GoogleDocs implements Node {
//       body: String
//     }
//   `)
// }
