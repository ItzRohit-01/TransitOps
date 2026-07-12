/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B132B',      // Deep navy primary
          navyLight: '#1C2541', // Lighter navy for subtle elements
          success: '#10B981',   // Green success
          warning: '#F59E0B',   // Amber warning
          danger: '#EF4444',    // Red danger
          ai: '#8B5CF6',        // Purple AI
          neutral: '#64748B',   // Slate gray
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px', // 16px border radius as per design system
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 10px -1px rgba(0, 0, 0, 0.03)',
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}


