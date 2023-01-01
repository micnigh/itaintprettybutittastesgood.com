require("dotenv").config()

const DEV = process.env.NODE_ENV === "development"

module.exports = {
  pathPrefix: "/",
  plugins: [
    {
      resolve: "gatsby-source-google-docs",
      options: {
        // https://drive.google.com/drive/u/0/folders/1rLwZdOpl3WxkNNuKPbO1s2YR9Ew7jZRf
        folder: "1rLwZdOpl3WxkNNuKPbO1s2YR9Ew7jZRf",
        // --------
        // Optional
        // --------
        debug: true,
        createPages: true,
        // skipImages: DEV ? true : false,
        imagesOptions: {
          width: DEV ? 512 : 1024,
        },
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
    // "gatsby-plugin-tailwindcss",
    "gatsby-plugin-catch-links",
    "gatsby-plugin-react-svg",
    "gatsby-plugin-eslint",
    "gatsby-plugin-layout",
    "gatsby-plugin-theme-ui",
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
