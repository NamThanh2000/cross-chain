import {
  blue,
  blueGrey,
  deepOrange,
  green,
  grey,
  indigo,
  orange,
  pink,
  teal,
} from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          // borderRadius: "3rem",
          fontWeight: 600,
        },
      },
    },
    MuiRating: {
      defaultProps: {
      },
    },
  },

  typography: {
    fontFamily: [
      "Lexend Deca",
      "Quicksand",
      "Nunito",
      "Nunito Sans",
      "Merriweather",
      "Montserrat",
      "Noto Sans",
      "Open Sans",
      "Oswald",
      "Raleway",
      "Roboto",
      "Source Sans Pro",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Helvetica",
      "Arial",
      "sans-serif",
      "serif",
      "Apple Color Emoji",
      "Segoe UI Emoji",
    ].join(", "),
    fontWeightRegular: 300,
    fontWeightMedium: 400,
    fontWeightBold: 500,
  },

  palette: {
    mode: "light",
    // primary: {
    //   light: indigo[400],
    //   main: indigo[500],
    //   dark: indigo[700],
    // },

    // secondary: {
    //   light: "#F6F7FC",
    //   main: "#222731",
    //   dark: "#1F212D",
    // },
    primary: {
      light: "#4caf50",
      main: "#4caf50",
      dark: green[800],
    },

    secondary: {
      light: '#1F212D',
      main: green[500],
      dark: green[500],
    },

    sub: {
      light: blueGrey[50],
      main: "#222731",
      dark: "#1F212D",
      contrastText: "#fff",
    },

    form: {
      light: indigo[50],
      main: indigo[500],
      dark: indigo[700],
      contrastText: "#fff",
    },

    notification: {
      light: "#ba68c8",
      main: "#9c27b0",
      dark: "#7b1fa2",
      contrastText: "#fff",
    },

    like: {
      main: blue[500],
    },

    favorite: {
      main: pink[500],
    },

    happy: {
      main: orange[500],
    },

    sad: {
      main: teal["A700"],
    },

    text: {
      primary: grey[800],
      light: grey[100],
      main: grey[500],
      dark: grey[600],
    },

    readingBackground: {
      default: grey[100],
      dark: "#1F212D",
      yellow: "#DACFA1",
      blue: blue[200],
      teal: teal[200],
      pink: pink[200],
      orange: deepOrange[200],
      grey: blueGrey[200],
    },

    readingPaper: {
      default: "#fff",
      dark: "#222731",
      yellow: "#F1E8C2",
      blue: blue[100],
      teal: teal[100],
      pink: pink[100],
      orange: deepOrange[100],
      grey: blueGrey[100],
    },

    success: {
      main: green["A700"],
      // contrastText: "#fff",
    },

    background: {
      paper: "#fff",
      default: "#fff",
    },
  },

  // breakpoints: {
  //   values: {
  //     xs: 0,
  //     sm: 600, //default: 600
  //     md: 900, //default: 960
  //     lg: 1366, //default: 1280
  //     xl: 1536, //default: 1920
  //   },
  // },
});

export const darkTheme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          // borderRadius: "3rem",
          fontWeight: 600,
        },
      },
    },
    MuiRating: {
      defaultProps: {
      },
    },
  },

  typography: {
    fontFamily: [
      "Lexend Deca",
      "Quicksand",
      "Nunito",
      "Nunito Sans",
      "Merriweather",
      "Montserrat",
      "Noto Sans",
      "Open Sans",
      "Oswald",
      "Raleway",
      "Roboto",
      "Source Sans Pro",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Helvetica",
      "Arial",
      "sans-serif",
      "serif",
      "Apple Color Emoji",
      "Segoe UI Emoji",
    ].join(", "),
    fontWeightRegular: 300,
    fontWeightMedium: 400,
    fontWeightBold: 500,
  },

  palette: {
    mode: "dark",
    // primary: {
    //   light: indigo[400],
    //   main: indigo[500],
    //   dark: indigo[700],
    // },

    // secondary: {
    //   light: "#F6F7FC",
    //   main: "#222731",
    //   dark: "#1F212D",
    // },
    primary: {
      light: "#26a69a1a",
      main: teal[400],
      dark: teal[700],
    },

    secondary: {
      light: "#e91e631a",
      main: green[500],
      dark: pink[800],
    },

    sub: {
      light: "#2E3D47",
      main: "#2E3D47",
      dark: "#253139",
      contrastText: "#fff",
    },

    form: {
      light: indigo[50],
      main: indigo[500],
      dark: indigo[700],
      contrastText: "#fff",
    },

    notification: {
      light: "#ba68c8",
      main: "#9c27b0",
      dark: "#7b1fa2",
      contrastText: "#fff",
    },

    like: {
      main: blue[500],
    },

    favorite: {
      main: pink[500],
    },

    happy: {
      main: orange[500],
    },

    sad: {
      main: teal["A700"],
    },

    text: {
      primary: grey[200],
      light: grey[50],
      main: grey[600],
      dark: grey[500],
    },

    readingBackground: {
      default: grey[100],
      dark: "#1F212D",
      yellow: "#DACFA1",
      blue: blue[200],
      teal: teal[200],
      pink: pink[200],
      orange: deepOrange[200],
      grey: blueGrey[200],
    },

    readingPaper: {
      default: "#fff",
      dark: "#222731",
      yellow: "#F1E8C2",
      blue: blue[100],
      teal: teal[100],
      pink: pink[100],
      orange: deepOrange[100],
      grey: blueGrey[100],
    },

    success: {
      main: green["A700"],
      // contrastText: "#fff",
    },

    background: {
      paper: "#222731",
      default: "#222731",
    },
  },

  // breakpoints: {
  //   values: {
  //     xs: 0,
  //     sm: 600, //default: 600
  //     md: 900, //default: 960
  //     lg: 1366, //default: 1280
  //     xl: 1536, //default: 1920
  //   },
  // },
});
