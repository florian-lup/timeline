/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "background-secondary": "var(--background-secondary)",
        "foreground-secondary": "var(--foreground-secondary)",
        accent: "var(--accent)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      screens: {
        xs: "480px",
        // sm, md, lg, xl come by default
        "2xl": "1536px",
        "3xl": "1920px",
      },
      fontSize: {
        '2xs': '0.625rem',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};

export default tailwindConfig; 