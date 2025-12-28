const LigamLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(265, 70%, 45%)" />
          <stop offset="50%" stopColor="hsl(265, 65%, 55%)" />
          <stop offset="100%" stopColor="hsl(265, 60%, 70%)" />
        </linearGradient>
      </defs>
      
      {/* Outer L-shaped bracket */}
      <path
        d="M6 8 L6 40 L22 40 L22 36 L10 36 L10 8 Z"
        fill="url(#logoGradient)"
      />
      
      {/* Inner reversed L bracket */}
      <path
        d="M42 40 L42 8 L26 8 L26 12 L38 12 L38 40 Z"
        fill="url(#logoGradient)"
      />
      
      {/* Chat bubble with dots */}
      <rect
        x="14"
        y="14"
        width="20"
        height="16"
        rx="3"
        fill="url(#logoGradient)"
      />
      
      {/* Three dots inside chat bubble */}
      <circle cx="19" cy="22" r="2" fill="hsl(240, 10%, 10%)" />
      <circle cx="24" cy="22" r="2" fill="hsl(240, 10%, 10%)" />
      <circle cx="29" cy="22" r="2" fill="hsl(240, 10%, 10%)" />
    </svg>
  );
};

export default LigamLogo;
