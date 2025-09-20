'use client';

interface LinesBackgroundProps {
  className?: string;
}

export function LinesBackground({ className = '' }: LinesBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Grid pattern */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168, 85, 247, 0.1)" strokeWidth="0.5"/>
          </pattern>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.5" fill="rgba(168, 85, 247, 0.2)"/>
          </pattern>
        </defs>
        
        {/* Background patterns */}
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#dots)" />
        
        {/* Subtle diagonal lines */}
        <line x1="0" y1="0" x2="1000" y2="1000" stroke="rgba(168, 85, 247, 0.05)" strokeWidth="1"/>
        <line x1="1000" y1="0" x2="0" y2="1000" stroke="rgba(168, 85, 247, 0.05)" strokeWidth="1"/>
        
        {/* Corner accent lines */}
        <line x1="0" y1="200" x2="200" y2="0" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="2"/>
        <line x1="800" y1="1000" x2="1000" y2="800" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="2"/>
        <line x1="0" y1="800" x2="200" y2="1000" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="2"/>
        <line x1="800" y1="0" x2="1000" y2="200" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="2"/>
      </svg>
    </div>
  );
}
