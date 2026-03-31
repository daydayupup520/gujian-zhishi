/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 明亮科技蓝色彩系统（提升亮度）
        'china': {
          'red': '#8b5cf6',              // 紫罗兰 - 强调色
          'red-light': '#a78bfa',
          'red-dark': '#7c3aed',
          'gold': '#3b82f6',             // 主蓝 - 主色
          'gold-light': '#60a5fa',
          'gold-dark': '#2563eb',
          'ink': '#1e293b',              // 深灰 - 主要文字
          'ink-light': '#334155',
          'ink-muted': '#64748b',
          'ink-soft': '#94a3b8',
          'paper': '#f8fafc',            // 浅灰白背景（原：#0f1024）
          'paper-dark': '#f1f5f9',       // 更浅的灰（原：#0a0a1a）
          'cinnabar': '#8b5cf6',         // 紫色
          'verdigris': '#06b6d4',        // 青色
          'indigo': '#6366f1',           // 靛蓝
          'cream': '#ffffff',            // 纯白（原：#0a0a1a）
        },
        'imperial-red': '#a78bfa',
        'imperial-gold': '#3b82f6',
        'imperial-black': '#0a0a1a',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.4)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
        'china-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      fontFamily: {
        'china': ['"Noto Serif SC"', '"Source Han Serif SC"', '"STSong"', '"SimSun"', 'serif'],
        'sans': ['Inter', 'PingFang SC', 'Noto Sans SC', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'china': '0 4px 20px rgba(59, 130, 246, 0.08)',
        'china-lg': '0 8px 40px rgba(59, 130, 246, 0.12)',
        'china-xl': '0 12px 60px rgba(59, 130, 246, 0.16)',
        'gold': '0 4px 20px rgba(59, 130, 246, 0.3)',
        'gold-lg': '0 8px 40px rgba(99, 102, 241, 0.4)',
      },
      borderRadius: {
        'china': '12px',
        'china-lg': '20px',
      },
      transitionTimingFunction: {
        'china': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'china-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        'china': '300ms',
        'china-slow': '500ms',
      },
    },
  },
  plugins: [],
}
