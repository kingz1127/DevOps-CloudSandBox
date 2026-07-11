/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all your components and pages
  ],
  theme: {
    extend: {
      colors: {
        // Custom DevOps "Cloud" Palette
        brand: {
          dark: '#0f172a',    // Deep slate for backgrounds
          accent: '#3b82f6',  // Blue for primary actions
          border: '#1e293b',  // Subtle border color
          success: '#10b981', // Green for "Running" status
        }
      }
    },
  },
  plugins: [],
}