import DotEnv from 'dotenv'
import { GatsbyConfig } from 'gatsby'

DotEnv.config()

const config: GatsbyConfig = {
  pathPrefix: "/",
  graphqlTypegen: true,
  plugins: [
    {
      resolve: "gatsby-source-google-docs",
      options: {
        folder: "1rLwZdOpl3WxkNNuKPbO1s2YR9Ew7jZRf", // https://drive.google.com/drive/u/0/folders/1rLwZdOpl3WxkNNuKPbO1s2YR9Ew7jZRf
        createPages: true,
      },
    },
    {
      resolve: "gatsby-plugin-webfonts",
      options: {
        fonts: {
          google: [
            {
              family: "Quicksand",
              variants: ["400", "700"],
              fontDisplay: "fallback",
            },
          ],
        },
        formats: ["woff2"],
        usePreload: true,
      },
    },
    "gatsby-plugin-catch-links",
    "gatsby-plugin-react-svg",
    "gatsby-plugin-eslint",
    "gatsby-plugin-layout",
    {
      resolve: "gatsby-plugin-theme-ui",
      options: {
        preset: require('./src/theme-ui/index.ts')
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-mdx-embed",
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          "gatsby-remark-unwrap-images",
          "gatsby-remark-images",
          "gatsby-remark-gifs",
          "gatsby-remark-prismjs",
        ],
      },
    },
  ],
}

export default config;