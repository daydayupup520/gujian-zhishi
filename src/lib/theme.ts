/**
 * 主题配置 - 支持亮色/暗色切换
 */

// 亮色主题配置
export const lightTheme = {
  // 背景色
  background: {
    primary: '#f8fafc',      // 主背景 - 浅灰白
    secondary: '#f1f5f9',    // 次背景
    card: 'rgba(255, 255, 255, 0.8)',  // 卡片背景
    cardHover: 'rgba(255, 255, 255, 0.95)',
    navbar: 'rgba(255, 255, 255, 0.95)',
  },
  
  // 文字色
  text: {
    primary: '#1e293b',      // 主文字 - 深灰
    secondary: '#475569',    // 次文字
    muted: '#64748b',        // 弱化文字
    accent: '#3b82f6',       // 强调色
  },
  
  // 边框
  border: {
    light: 'rgba(99, 102, 241, 0.15)',
    medium: 'rgba(99, 102, 241, 0.25)',
    strong: 'rgba(99, 102, 241, 0.4)',
  },
  
  // 阴影
  shadow: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
    md: '0 4px 16px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
};

// 暗色主题配置（原主题）
export const darkTheme = {
  background: {
    primary: '#0f1024',
    secondary: '#0a0a1a',
    card: 'rgba(15, 20, 40, 0.6)',
    cardHover: 'rgba(15, 20, 40, 0.8)',
    navbar: 'rgba(10, 10, 26, 0.95)',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#cbd5e1',
    muted: '#94a3b8',
    accent: '#60a5fa',
  },
  border: {
    light: 'rgba(99, 102, 241, 0.1)',
    medium: 'rgba(99, 102, 241, 0.2)',
    strong: 'rgba(99, 102, 241, 0.3)',
  },
  shadow: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0 4px 16px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
  },
};

// 当前主题（默认亮色）
export const currentTheme = lightTheme;

// 主题切换函数
export function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  
  if (isDark) {
    html.classList.remove('dark');
    html.classList.add('light');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.remove('light');
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

// 初始化主题
export function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const html = document.documentElement;
  
  if (savedTheme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.add('light');
  }
}
