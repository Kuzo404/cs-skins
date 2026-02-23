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
        // Military / dusty warzone palette
        "cs-bg": "#0f0e0c",
        "cs-dark": "#141310",
        "cs-darker": "#0a0a08",
        "cs-card": "#1c1b17",
        "cs-card-hover": "#252419",
        "cs-border": "#2e2c24",
        "cs-border-light": "#3d3a2f",
        "cs-orange": "#e8a924",
        "cs-orange-hover": "#d49a1c",
        "cs-yellow": "#f0c040",
        "cs-sand": "#c4a55a",
        "cs-khaki": "#8b7d5e",
        "cs-olive": "#4a5a2b",
        "cs-military": "#3d4a2a",
        "cs-gunmetal": "#4a4d50",
        "cs-steel": "#6b7280",
        "cs-rust": "#a0522d",
        "cs-muzzle": "#ff6b2b",
        "cs-purple": "#8b5cf6",
        "cs-blue": "#4a8eff",
        "cs-green": "#5cb85c",
        "cs-red": "#dc3545",
        "cs-gray": "#7a7568",
        "cs-gray-light": "#a09882",
        "cs-light": "#d4ccb8",
        "cs-smoke": "rgba(20, 19, 16, 0.85)",

        "rarity-consumer": "#b0c3d9",
        "rarity-industrial": "#5e98d9",
        "rarity-milspec": "#4b69ff",
        "rarity-restricted": "#8847ff",
        "rarity-classified": "#d32ce6",
        "rarity-covert": "#eb4b4b",
        "rarity-gold": "#e4ae39",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0a0a08 0%, #1c1b17 30%, #141310 60%, #0f0e0c 100%)",
        "dust-overlay": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
        "tactical-grid": "linear-gradient(rgba(46,44,36,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(46,44,36,0.3) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-size": "40px 40px",
      },
      animation: {
        "float": "float 4s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.6s ease-out",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "shimmer": "shimmer 2s linear infinite",
        "dust": "dust 8s ease-in-out infinite",
        "flicker": "flicker 4s ease-in-out infinite",
        "scan": "scan 3s linear infinite",
        "border-glow": "borderGlow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(232, 169, 36, 0.2), 0 0 10px rgba(232, 169, 36, 0.1)" },
          "100%": { boxShadow: "0 0 20px rgba(232, 169, 36, 0.4), 0 0 40px rgba(232, 169, 36, 0.15)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        dust: {
          "0%, 100%": { opacity: "0.3", transform: "translate(0, 0)" },
          "25%": { opacity: "0.6", transform: "translate(3px, -5px)" },
          "50%": { opacity: "0.4", transform: "translate(-2px, -10px)" },
          "75%": { opacity: "0.5", transform: "translate(4px, -3px)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
          "75%": { opacity: "0.95" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        borderGlow: {
          "0%": { borderColor: "rgba(232, 169, 36, 0.15)" },
          "100%": { borderColor: "rgba(232, 169, 36, 0.4)" },
        },
      },
      boxShadow: {
        "glow-sm": "0 0 10px rgba(232, 169, 36, 0.15)",
        "glow-md": "0 0 20px rgba(232, 169, 36, 0.2), 0 0 40px rgba(232, 169, 36, 0.1)",
        "glow-lg": "0 0 30px rgba(232, 169, 36, 0.3), 0 0 60px rgba(232, 169, 36, 0.15)",
        "glow-muzzle": "0 0 20px rgba(255, 107, 43, 0.3), 0 0 40px rgba(255, 107, 43, 0.15)",
        "inner-glow": "inset 0 0 20px rgba(232, 169, 36, 0.1)",
        "war": "0 4px 30px rgba(0, 0, 0, 0.5), 0 0 1px rgba(232, 169, 36, 0.3)",
      },
      dropShadow: {
        "glow": "0 0 8px rgba(232, 169, 36, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
