import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "btn",
    "btn-ghost",
    "btn-circle",
    "btn-square",
    "btn-outline",
    "avatar",
    "menu",
    "menu-sm",
    "dropdown-content",
    "navbar",
    "drawer",
    "drawer-toggle",
    "dropdown-end",
    "drawer-side",
    "drawer-overlay",
    "dropdown",
    "bg-base-100",
    "rounded-box",
    "my-drawer",
    "bg-base-300",
    "w-screen",
    "flex",
    "py-4",
  ],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      display: ["responsive", "group-hover", "focus-within", "hover", "focus"],
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [require("daisyui")],
} satisfies Config;
