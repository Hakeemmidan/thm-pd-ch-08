import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(236, 28%, 12%)",
        "background-card": "hsl(236, 28%, 16%)",
        "background-hover": "hsl(236, 28%, 20%)",
        "text-primary": "#ffffff",
        "text-secondary": "rgba(255, 255, 255, 0.6)",
        "text-muted": "rgba(255, 255, 255, 0.4)",
        "accent-pink": "rgb(232, 100, 145)",
        "accent-gold": "rgb(227, 189, 113)",
        "accent-purple": "rgb(123, 123, 240)",
        "accent-violet": "rgb(186, 111, 222)",
        "accent-coral": "rgb(207, 129, 99)",
        "accent-cyan": "rgb(77, 174, 232)",
        "accent-magenta": "rgb(255, 120, 201)",
      },
      fontFamily: {
        sans: ["var(--font-ibm-plex-arabic)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
