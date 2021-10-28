//Tailwind default colors
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    important: true,
    textColor: {
      taupe: 'var(--taupe)',
      content_black: 'var(--content-black)', 
      grey_desc: 'var(--grey-desc)',
      teal: 'var(--teal)',
      white: 'var(--white-text)',
      dark_grey: 'var(--dark-grey-text)',
      greyed_out_text: 'var(--greyed-out-text)', 
      dark_green: 'var(--dark-green)'
    },
    extend: {
      //MUI Breakpoints
      screens: {
        sm: "600px",
        md: "900px",
        lg: "1200px",
        xl: "1536px",
        '-xl': { max: "1536px" },
        '-lg': { max: "1200px" },
        '-md': { max: "900px" },
        '-sm': { max: "600px" },
      },

      //MUI Spacing ( 1 = 8px )
      spacing: {
        px: "1px",
        0: "0",
        "0_5": "4px",
        1: "8px",
        "1_5": "12px",
        2: "16px",
        "2_5": "20px",
        3: "24px",
        "3_5": "28px",
        4: "32px",
        "4_5": "36px",
        5: "40px",
        "5_5": "44px",
        6: "48px",
        "6_5": "52px",
        7: "56px",
        "7_5": "60px",
        8: "64px",
        "8_5": "68px",
        9: "72px",
        "9_5": "76px",
        10: "80px",
      },
      //Custom Font Family
      fontFamily: {
        grotesque: "var(--font-grotesque)",
        hanson: "var(--font-hanson)",
        lato: "var(--font-lato)",
        poppins: "var(--font-poppins)",
        prox: "var(--font-prox)",
        sofia: "var(--font-sofia)",
      },
      //Reef Colors

      colors: {
        // red: {'var(--primary)'},
        primary: "var(--primary)",
        primary_medium: "var(--primary-medium)",
        primary_light: "var(--primary-light)",
        secondary: "var(--secondary)",
        blue_munsell: "var(--blue-munsell)",
        green_select: "var(--green-select)",
        green_bg: "var(--green-bg)",
        success: "var(--success)",
        error: "var(--error)",
        grey_body: "var(--grey-body)",
        grey_label: "var(--grey-label)",
        grey_placeholder: "var(--grey-placeholder)",
        grey_line: "var(--grey-line)",
        grey_bg_option: "var(--grey-bg-option)",
        grey_input_bg: "var(--grey-input-bg)",
        grey_bg: "var(--grey-bg)",
        grey_off_white: "var(--grey-off-white)",
        grey_title_active: "var(--grey-title-active)",
        grey_desc: "var(--grey-desc)",
        grey_border: "var(--grey-border)",
        grey_border_dark: "var(--grey-border-dark)",
        greyed_out: "var(--greyed-out)",
        cta1: "var(--cta-1)",
        cta2: "var(--cta-2)",
        content_black: "var(--content-black)",
        ghost_white: 'var(--ghost-white)',
        greyed_out: 'var(--greyed-out)',
        teal: 'var(--teal)',
        dark_green: 'var(--dark-green)',
      },
      ringColor: ["hover", "active"],
      ringWidth: ["hover", "active"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
