import DotEnv from 'dotenv'
import { GatsbyConfig } from 'gatsby'

DotEnv.config()

const config: GatsbyConfig = {
  pathPrefix: "/",
  graphqlTypegen: true,
  trailingSlash: 'ignore',
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
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          "gatsby-remark-unwrap-images",
          "gatsby-remark-images",
          "gatsby-remark-gifs",
          "gatsby-remark-prismjs",
        ]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
        // Ignore files starting with a dot
        ignore: [`**/\.*`,`**/*\.d\.ts`],
        // Use "mtime" and "inode" to fingerprint files (to check if file has changed)
        fastHash: true,
      },
    },
  ],
}

export default config;
