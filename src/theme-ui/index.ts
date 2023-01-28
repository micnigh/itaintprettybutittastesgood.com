import { Theme } from "theme-ui"

const theme: Theme = {
  space: [0, 8, 16, 32, 64],
  radii: [0, 10, 20],
  breakpoints: ["500px", "800px", "1080px"],
  fontSizes: [12, 14, 16, 24, 26, 28, 30, 32],
  colors: {
    text: "#333333",
    background: "#F9DFC9",
    primary: "#6F2B9F",
    secondary: "#4d90fe",
    modes: {
      dark: {

      },
    },
  },
  textStyles: {
    heading: {
      m: 0,
      mb: 1,
      color: 'black',
    },
  },
  styles: {
    root: {
      fontFamily: "Quicksand",
      scrollbarGutter: 'stable both-edges',
    },
    a: {
      color: "secondary",
      textDecoration: "none",
      fontWeight: 'bold',
    },
    h1: {
      variant: "textStyles.heading",
      fontSize: 6,
    },
    h2: {
      variant: "textStyles.heading",
      fontSize: 5,
    },
    h3: {
      variant: "textStyles.heading",
      fontSize: 4,
    },
    h4: {
      variant: "textStyles.heading",
      fontSize: 3,
    },
    h5: {
      variant: "textStyles.heading",
      fontSize: 2,
    },
    h6: {
      variant: "textStyles.heading",
      fontSize: 1,
    },
  },
}

export default theme
