export const primaryFont = "Grotesque";
export const secondaryFont = "GrotesqueBold";
export const baseFontSize = "16px";
export const fallbackFonts = "Roboto, Helvetica, Arial, sans-serif";

const typography = {
  htmlFontSize: parseInt(baseFontSize, 10),
  fontFamily: `${primaryFont}, ${fallbackFonts}`,
  body1: {
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "0px",
  },
  body2: {
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "18px",
    letterSpacing: "-0.25px",
  },
  button: {
    fontSize: "20px",
    lineHeight: "24px",
    textTransform: "none", //no uppercase
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },
  caption: {
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "0px",
  },
  h1: {
    fontSize: "60px",
    lineHeight: "64px",
    letterSpacing: "-0.5%",
  },
  h2: {
    fontSize: "60px",
    lineHeight: "64px",
    letterSpacing: "-0.5%",
  },
  h3: {
    fontSize: "48px",
    fontWeight: 700,
    lineHeight: "56px",
    letterSpacing: "-0.5px",
  },
  h4: {
    fontSize: "24px",
    lineHeight: "32px",
    letterSpacing: "-0.25px",
  },
  h5: {
    fontFamily: "Sofia Pro",
    fontSize: "20px",
    lineHeight: "24px",
    letterSpacing: "-0.15px",
  },
  h6: {
    fontSize: "18px",
    lineHeight: "24px",
    fontWeight: "bold",
    letterSpacing: "-0.15px",
  },
  subtitle1: {
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "-0.25px",
  },
  subtitle2: {
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: "16px",
    letterSpacing: "0.15px",
  },
};

export default typography;
