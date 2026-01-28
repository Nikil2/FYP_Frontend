import type { Config } from "tailwindcss";
import { PluginAPI } from "tailwindcss/types/config";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/containers/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/elements/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			'secondary-background': 'var(--secondary-background)',
  			foreground: 'hsl(var(--foreground))',
  			heading: 'var(--heading)',
  			paragraph: 'var(--paragraph)',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  				hover: 'var(--primary-hover)'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))',
  				hover: 'var(--secondary-hover)'
  			},
  			tertiary: {
  				DEFAULT: 'var(--tertiary)',
  				foreground: 'var(--tertiary-foreground)',
  				hover: 'var(--tertiary-hover)'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))',
  				hover: 'var(--muted-hover)'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			heading: [
  				'var(--font-inter)',
  				'sans-serif'
  			],
  			body: [
  				'var(--font-inter)',
  				'sans-serif'
  			]
  		},
  		backgroundImage: {
			 "landing-hero": "url('/images/hero-img03.png')",
		},
  		screens: {
  			xs: '400px',
  			sm: '480px',
  			md: '768px',
  			lg: '1024px',
  			xl: '1440px',
  			'2xl': '1536px'
  		},
  		keyframes: {},
  		animation: {}
  	}
  },
  plugins: [
    function ({ addComponents }: PluginAPI) {
      addComponents({
        ".layout-standard": {
          maxWidth: "1536px",
          width: "90%",
          marginLeft: "auto",
          marginRight: "auto",
        },
        ".page-layout-standard": {
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
        },
        ".section-padding-standard": {
          paddingTop: "2rem",
          paddingBottom: "2rem",
          "@screen lg": {
            paddingTop: "3rem",
            paddingBottom: "3rem",
          },
        },
        ".section-margin-standard": {
          marginTop: "3rem",
          marginBottom: "3rem",
          "@screen lg": {
            marginTop: "4rem",
            marginBottom: "4rem",
          },
        },
        ".animation-standard": {
          transition: "all 0.3s ease-in-out",
        },
        ".flex-center": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      });
    },
    tailwindcssAnimate,
    require("tailwindcss-animate"),
  ],
} satisfies Config;
