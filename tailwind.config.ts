import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-border': 'linear-gradient(to right, #8692FE, #c084fc)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        sparkle: {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0)' 
          },
          '50%': { 
            opacity: '1', 
            transform: 'scale(1)' 
          },
          '100%': { 
            opacity: '0', 
            transform: 'scale(0)' 
          },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(var(--tw-float-x, 25px), var(--tw-float-y, 25px))' },
          '66%': { transform: 'translate(calc(var(--tw-float-x, 25px) * -1), calc(var(--tw-float-y, 25px) * -1))' },
        }
      },
      animation: {
        sparkle: 'sparkle 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
