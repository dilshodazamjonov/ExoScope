import { Telescope } from "lucide-react";

interface ExoScopeLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  showBadge?: boolean;
  className?: string;
}

export function ExoScopeLogo({ 
  size = 'md', 
  showText = true, 
  showBadge = true,
  className = "" 
}: ExoScopeLogoProps) {
  const sizes = {
    sm: {
      container: "h-6 w-6",
      inner: "inset-0.5",
      telescope: "h-2.5 w-2.5",
      dots: "h-0.5 w-0.5",
      text: "text-sm",
      badge: "text-xs px-1.5 py-0"
    },
    md: {
      container: "h-10 w-10",
      inner: "inset-1",
      telescope: "h-4 w-4",
      dots: "h-1 w-1",
      text: "text-base",
      badge: "text-xs px-2 py-0.5"
    },
    lg: {
      container: "h-16 w-16",
      inner: "inset-1.5",
      telescope: "h-6 w-6",
      dots: "h-1.5 w-1.5",
      text: "text-xl",
      badge: "text-sm px-3 py-1"
    }
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Professional ExoScope Logo */}
      <div className="relative">
        {/* Outer orbital ring */}
        <div className={`${s.container} rounded-full border-2 border-blue-400/60 relative animate-spin`} 
             style={{ animationDuration: '20s' }}>
          {/* Inner core with telescope */}
          <div className={`absolute ${s.inner} bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg cosmic-glow`}>
            <Telescope className={`${s.telescope} text-white`} />
          </div>
          
          {/* Orbital dots representing exoplanets */}
          <div className={`absolute -top-0.5 left-1/2 transform -translate-x-1/2 ${s.dots} bg-green-400 rounded-full planet-glow`}></div>
          <div className={`absolute top-1/2 -right-0.5 transform -translate-y-1/2 ${s.dots} bg-blue-300 rounded-full`}></div>
          <div className={`absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 ${s.dots} bg-purple-400 rounded-full`}></div>
          <div className={`absolute top-1/2 -left-0.5 transform -translate-y-1/2 ${s.dots} bg-cyan-400 rounded-full`}></div>
        </div>
        
        {/* Subtle pulse glow effect */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse"></div>
      </div>
      
      {showText && (
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`font-semibold tracking-wide ${s.text}`}>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ExoScope
              </span>
            </h1>
            {showBadge && (
              <span className={`${s.badge} bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full font-medium`}>
                NASA
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span>Exoplanet Discovery Platform</span>
          </div>
        </div>
      )}
    </div>
  );
}