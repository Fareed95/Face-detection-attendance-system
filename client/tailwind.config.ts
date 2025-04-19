/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";
const svgToDataUri = require("mini-svg-data-uri");
const colors = require("tailwindcss/colors");
const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'neutral-glass': 'rgba(255, 255, 255, 0.1)',
        'neutral-text': '#E5E5E5',
        'neutral-accent': '#A3A3A3',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'glass-hover': 'rgba(255, 255, 255, 0.15)',
        // AI Education theme colors
        'ai-blue': {
          50: '#e6f1ff',
          100: '#cce3ff',
          200: '#99c8ff',
          300: '#66adff',
          400: '#3392ff',
          500: '#0A84FF', // Primary blue
          600: '#0068cc',
          700: '#004c99',
          800: '#003366',
          900: '#001933',
        },
        'ai-teal': {
          50: '#e6fffd',
          100: '#ccfffc',
          200: '#99fff9',
          300: '#66fff6',
          400: '#33fff3',
          500: '#00E6E6', // Secondary teal
          600: '#00b8b8',
          700: '#008a8a',
          800: '#005c5c',
          900: '#002e2e',
        },
        'ai-purple': {
          50: '#f3e6ff',
          100: '#e7ccff',
          200: '#cf99ff',
          300: '#b766ff',
          400: '#9f33ff',
          500: '#8700FF', // Accent purple
          600: '#6c00cc',
          700: '#510099',
          800: '#360066',
          900: '#1b0033',
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        scroll: "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        shimmer: "shimmer 2s linear infinite",
        'neon-glow': 'neon-glow 1.5s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'typewriter': 'typewriter 2s steps(40) 1s forwards, blink 1s infinite',
        'gradient-shift': 'gradient-shift 10s ease infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        'orbit-slow': 'orbit 40s linear infinite',
        'orbit-medium': 'orbit 30s linear infinite reverse',
        'orbit-fast': 'orbit 20s linear infinite',
        'gradient': 'gradient 15s ease infinite alternate',
      },
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
        'neon': '0 0 20px rgba(0, 230, 230, 0.5)',
        'neon-hover': '0 0 30px rgba(0, 230, 230, 0.8)',
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
        spotlight: {
          "0%": {
            opacity: '0',
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: '1',
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        'neon-glow': {
          '0%': { boxShadow: '0 0 10px #0A84FF, 0 0 20px #0A84FF, 0 0 30px #00E6E6' },
          '100%': { boxShadow: '0 0 20px #0A84FF, 0 0 30px #0A84FF, 0 0 40px #00E6E6' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'typewriter': {
          from: { width: '0' },
          to: { width: '100%' }
        },
        'blink': {
          '50%': { borderColor: 'transparent' }
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    addVariablesForColors,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" fill=\"none\" stroke=\"${value}\"><path d=\"M0 .5H31.5V32\"/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" width=\"8\" height=\"8\" fill=\"none\" stroke=\"${value}\"><path d=\"M0 .5H31.5V32\"/></svg>`
            )}")`,
          }),
          "bg-dot": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" width=\"16\" height=\"16\" fill=\"none\"><circle fill=\"${value}\" id=\"pattern-circle\" cx=\"10\" cy=\"10\" r=\"1.6257413380501518\"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
    require("tailwindcss-animate")
  ],
} satisfies Config;

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default config;
