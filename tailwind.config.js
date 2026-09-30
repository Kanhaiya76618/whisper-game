/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF8EC",
          surface: "#EAE7D5",
          surfaceHover: "#E2DFC9",
          border: "rgba(28, 27, 23, 0.22)",
        },
        ink: {
          DEFAULT: "#1C1B17",
          muted: "rgba(28, 27, 23, 0.65)",
          faint: "rgba(28, 27, 23, 0.40)",
        }
      },
      fontFamily: {
        serif: ["Instrument Serif", "Fraunces", "Georgia", "serif"],
        sans: ["Inter", "Geist", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
