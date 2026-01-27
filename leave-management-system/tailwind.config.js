// filepath: leave-management-system/tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#0F2A44",
        secondary: "#C2B280",
        success: "#1E7F43",
        danger: "#8B1E1E",
        surface: "#F3F4F6",
      },
    },
  },
  plugins: [],
};