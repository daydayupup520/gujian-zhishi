import React from 'react';

interface DecorativeCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const DecorativeCorner: React.FC<DecorativeCornerProps> = ({ position, className = '' }) => {
  const rotations = {
    'top-left': '0deg',
    'top-right': '90deg',
    'bottom-right': '180deg',
    'bottom-left': '270deg',
  };

  return (
    <svg
      viewBox="0 0 60 60"
      className={`absolute w-16 h-16 ${className}`}
      aria-label="装饰性角落"
      style={{
        transform: `rotate(${rotations[position]})`,
        ...(position.includes('top') ? { top: '0' } : { bottom: '0' }),
        ...(position.includes('left') ? { left: '0' } : { right: '0' }),
      }}
    >
      <path
        d="M0 60 L0 0 L60 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      <path
        d="M0 45 L0 0 L45 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.2"
      />
      <circle cx="5" cy="5" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="15" cy="5" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="5" cy="15" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  );
};

interface DecorativeDividerProps {
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

export const DecorativeDivider: React.FC<DecorativeDividerProps> = ({ 
  className = '', 
  variant = 'horizontal' 
}) => {
  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-china-gold/40 to-transparent" />
        <div className="w-2 h-2 rounded-full bg-china-gold/50 my-1" />
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-china-gold/40 to-transparent" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent via-china-gold/40 to-china-gold/40" />
      <svg viewBox="0 0 20 20" className="w-5 h-5 text-china-gold/50" aria-label="装饰性分隔符">
        <circle cx="10" cy="10" r="4" fill="currentColor" />
        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent via-china-gold/40 to-china-gold/40" />
    </div>
  );
};

interface CloudPatternProps {
  className?: string;
}

export const CloudPattern: React.FC<CloudPatternProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 120 40"
      className={`text-china-gold/10 ${className}`}
      fill="currentColor"
      aria-label="云纹装饰"
    >
      <path d="M10 30 Q15 20 25 25 Q35 15 45 25 Q55 20 65 30 Q75 25 85 30 Q95 20 105 25 Q115 30 120 35 L120 40 L0 40 L0 35 Q5 35 10 30Z" />
    </svg>
  );
};

interface SealStampProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SealStamp: React.FC<SealStampProps> = ({ text, className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base',
  };

  return (
    <div
      className={`relative ${sizes[size]} ${className}`}
      style={{ fontFamily: "'Noto Serif SC', serif" }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-label="印章边框">
        <rect
          x="5"
          y="5"
          width="90"
          height="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-china-red"
        />
        <rect
          x="12"
          y="12"
          width="76"
          height="76"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-china-red"
          opacity="0.5"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-china-red font-bold writing-vertical-rl" style={{ writingMode: 'vertical-rl' }}>
          {text}
        </span>
      </div>
    </div>
  );
};

interface TraditionalBorderProps {
  children: React.ReactNode;
  className?: string;
}

export const TraditionalBorder: React.FC<TraditionalBorderProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Corners */}
      <DecorativeCorner position="top-left" />
      <DecorativeCorner position="top-right" />
      <DecorativeCorner position="bottom-left" />
      <DecorativeCorner position="bottom-right" />
      
      {/* Content */}
      <div className="relative z-10 p-8">
        {children}
      </div>
    </div>
  );
};

interface WaveSeparatorProps {
  className?: string;
  flip?: boolean;
}

export const WaveSeparator: React.FC<WaveSeparatorProps> = ({ className = '', flip = false }) => {
  return (
    <svg
      viewBox="0 0 1440 120"
      className={`w-full h-auto ${className}`}
      style={{ transform: flip ? 'rotate(180deg)' : undefined }}
      preserveAspectRatio="none"
      aria-label="波浪分隔符"
    >
      <path
        d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"
        fill="currentColor"
        className="text-china-paper"
        opacity="0.5"
      />
      <path
        d="M0,80 C360,140 1080,20 1440,80 L1440,120 L0,120 Z"
        fill="currentColor"
        className="text-china-paper-dark"
        opacity="0.3"
      />
    </svg>
  );
};

interface LatticePatternProps {
  className?: string;
}

export const LatticePattern: React.FC<LatticePatternProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`text-china-gold/5 ${className}`}
      fill="currentColor"
      aria-label="格子纹样"
    >
      <path d="M0 0 L100 0 L100 100 L0 100 Z M20 20 L20 80 L80 80 L80 20 Z" fillRule="evenodd" />
      <path d="M20 0 L20 20 M80 0 L80 20 M20 80 L20 100 M80 80 L80 100" stroke="currentColor" strokeWidth="2" />
      <path d="M0 20 L20 20 M80 20 L100 20 M0 80 L20 80 M80 80 L100 80" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};
