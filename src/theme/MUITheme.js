import { createTheme } from "@material-ui/core/styles";
import typography from "./typography";

// colors
const primary = "#030E1B";
const secondary = "#298F9B";

// border
const borderWidth = 1;
const borderColor = "#E9ECEF";

// breakpoints
const xl = 1920;
const lg = 1280;
const md = 960;
const sm = 600;
const xs = 0;

// spacing
const spacing = 8;

const theme = createTheme({
  palette: {
    primary: { main: primary },
    secondary: { main: secondary },

    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
    // background: {
    //     default: background
    // },
    spacing,
  },
  breakpoints: {
    // Define custom breakpoint values.
    // These will apply to Material-UI components that use responsive
    // breakpoints, such as `Grid` and `Hidden`. You can also use the
    // theme breakpoint functions `up`, `down`, and `between` to create
    // media queries for these breakpoints
    values: {
      xl,
      lg,
      md,
      sm,
      xs,
    },
  },
  typography,
  border: {
    borderColor: borderColor,
    borderWidth: borderWidth,
  },
  shape: {
    borderRadius: 1, //border radius of buttons etc..
  },
  props: {
    MuiButtonBase: {
      disableRipple: true, //disable click ripple effect in buttons
    },
    MuiButton: {
      disableElevation: true, //disable box-shadow in buttons
    },
  },
  overrides: {
    MuiDivider: {
      root: {
        backgroundColor: borderColor,
        height: borderWidth,
      },
    },
    MuiListItem: {
      divider: {
        borderBottom: `${borderWidth}px solid ${borderColor}`,
      },
    },
  },
});

export default theme;
