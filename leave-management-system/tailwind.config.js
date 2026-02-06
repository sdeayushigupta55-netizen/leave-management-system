// filepath: leave-management-system/tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#1a237e",
        "primary-dark": "#0d1b2a",
        "primary-light": "#303f9f",
        accent: "#c5a200",
        "accent-light": "#ffd54f",
        secondary: "#C2B280",
        success: "#138808",
        danger: "#c62828",
        surface: "#F3F4F6",
      },
    },
     screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};

