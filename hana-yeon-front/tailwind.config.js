const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./src/**/*.stories.{ts,tsx}",
    "./.storybook/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        brand: "hsl(var(--brand))",
        olo: "hsl(var(--olo))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        yeon: "#eb7474",
        // darkCard: "#17171C",
        // darkBg: "#101013",
        darkCard: "#1f2937",
        darkBg: "#191f28",
        darkTextMain: "#d1d5db",
        darkTextSub: "#9ca3af",
        background: "#E8EAED",
        lightCard: "#FFFFFF",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--olo))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      fontFamily: {
        pretendard: ["Pretendard", ...fontFamily.sans],
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(-50%)" },
          "50%": { transform: "translateY(0)" },
        },
        "flash-red": {
          "0%": { backgroundColor: "rgba(255, 0, 0, 0.2)" },
          "100%": { backgroundColor: "transparent" },
        },
        "flash-blue": {
          "0%": { backgroundColor: "rgba(0, 0, 255, 0.2)" },
          "100%": { backgroundColor: "transparent" },
        },
        "flash-border-red": {
          "0%": {
            boxShadow:
              "0 0 0 1px rgba(255, 0, 0, 0.8), 0 0 0 2px rgba(255, 0, 0, 0.4)",
          },
          "100%": {
            boxShadow: "0 0 0 1px transparent, 0 0 0 2px transparent",
          },
        },
        "flash-border-blue": {
          "0%": {
            boxShadow:
              "0 0 0 1px rgba(0, 100, 255, 0.8), 0 0 0 2px rgba(0, 100, 255, 0.4)",
          },
          "100%": {
            boxShadow: "0 0 0 1px transparent, 0 0 0 2px transparent",
          },
        },
        "right-left": {
          "0%, 100%": { transform: "translateX(-20%)" },
          "80%": { transform: "translateX(0)" },
        },
        "left-right": {
          "0%, 100%": { transform: "translateX(20%)" },
          "80%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        bounce: "bounce 1s infinite",
        "flash-red": "flash-red 0.5s ease-out",
        "flash-blue": "flash-blue 0.5s ease-out",
        "flash-border-red": "flash-border-red 5s ease-out",
        "flash-border-blue": "flash-border-blue 5s ease-out",
        "right-left": "right-left 0.8s linear infinite",
        "left-right": "left-right 0.8s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
