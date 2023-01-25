const theme = {
  space: [0, 8, 16, 32, 64],
  radii: [0, 10, 20],
  breakpoints: ["500px", "800px", "1080px"],
  fontSizes: [12, 14, 16, 24, 26, 28, 30, 32],
  colors: {
    text: "#333333",
    background: "#FFFFFF",
    primary: "#6F2B9F",
    secondary: "#4d90fe",
    white: "#FFFFFF",
    grey: "#F3F3F3",
    modes: {
      dark: {
        text: "#333",
        background: "#ffffff",
      },
    },
  },
  buttons: {
    primary: {
      py: 2,
      px: 4,
      cursor: "pointer",
    },
  },
  textStyles: {
    fontSize: 3,
    color: 'green',
    heading: {
      margin: 0,
      mb: 1,
      color: 'black',
    },
  },
  styles: {
    root: {
      padding: [2, 3],
      fontFamily: "Quicksand",
      backgroundColor: 'white',
    },
    a: {
      textDecoration: "none",
      color: "secondary",
      fontWeight: 'bold',
    },
    h1: {
      variant: "textStyles.heading",
      fontSize: [4, 5, 6],
    },
    h2: {
      variant: "textStyles.heading",
      fontSize: [6],
    },
    h3: {
      variant: "textStyles.heading",
      fontSize: 5,
    },
    h4: {
      variant: "textStyles.heading",
      fontSize: 4,
    },
    h5: {
      variant: "textStyles.heading",
      fontSize: 1,
    },
    h6: {
      variant: "textStyles.heading",
      fontSize: 0,
    },
  },
}

export default theme
