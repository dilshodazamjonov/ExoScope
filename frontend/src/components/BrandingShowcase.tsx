import { ExoScopeLogo } from "./ExoScopeLogo";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Telescope, Satellite, Target, Zap } from "lucide-react";

export function BrandingShowcase() {
  return (
    <div className="p-6 space-y-8">
      {/* Hero Logo Section */}
      <Card className="p-8 text-center space-card">
        <div className="flex justify-center mb-6">
          <ExoScopeLogo size="lg" showText={true} showBadge={true} />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Advanced Exoplanet Discovery Platform
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Real-time AI-powered analysis of telescope data from TESS, Kepler, JWST, and Spitzer missions
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-400/30">
              <Telescope className="h-3 w-3 mr-1" />
              Multi-Telescope
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-400/30">
              <Target className="h-3 w-3 mr-1" />
              Real-Time
            </Badge>
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30">
              <Satellite className="h-3 w-3 mr-1" />
              Space-Based
            </Badge>
          </div>
        </div>
      </Card>

      {/* Logo Variations */}
      <Card className="p-6 space-card">
        <h3 className="font-semibold mb-4">Logo Variations</h3>
        <div className="space-y-6">
          {/* Large with text */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Large (Hero)</span>
            <ExoScopeLogo size="lg" showText={true} showBadge={true} />
          </div>
          
          {/* Medium with text */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Medium (Header)</span>
            <ExoScopeLogo size="md" showText={true} showBadge={true} />
          </div>
          
          {/* Small with text */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Small (Compact)</span>
            <ExoScopeLogo size="sm" showText={true} showBadge={true} />
          </div>
          
          {/* Icon only variations */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Icon Only</span>
            <div className="flex items-center gap-4">
              <ExoScopeLogo size="lg" showText={false} showBadge={false} />
              <ExoScopeLogo size="md" showText={false} showBadge={false} />
              <ExoScopeLogo size="sm" showText={false} showBadge={false} />
            </div>
          </div>
        </div>
      </Card>

      {/* Brand Colors */}
      <Card className="p-6 space-card">
        <h3 className="font-semibold mb-4">Brand Colors</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="h-12 w-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-2 cosmic-glow"></div>
            <p className="text-xs text-muted-foreground">Primary Gradient</p>
          </div>
          <div className="text-center">
            <div className="h-12 w-full bg-blue-400 rounded-lg mb-2"></div>
            <p className="text-xs text-muted-foreground">Blue Accent</p>
          </div>
          <div className="text-center">
            <div className="h-12 w-full bg-green-400 rounded-lg mb-2 planet-glow"></div>
            <p className="text-xs text-muted-foreground">Habitable Zone</p>
          </div>
          <div className="text-center">
            <div className="h-12 w-full bg-purple-400 rounded-lg mb-2"></div>
            <p className="text-xs text-muted-foreground">Discovery</p>
          </div>
        </div>
      </Card>
    </div>
  );
}