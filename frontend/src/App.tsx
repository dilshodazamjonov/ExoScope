import { useState } from "react";
import { Badge } from "./components/ui/badge";
import { MobileHeader } from "./components/MobileHeader";
import { TelescopeFeeds } from "./components/TelescopeFeeds";
import { ExoplanetCard } from "./components/ExoplanetCard";
import { CameraSkyView } from "./components/CameraSkyView";
import { BottomNavigation } from "./components/BottomNavigation";
import { BrandingShowcase } from "./components/BrandingShowcase";

const mockExoplanets = [
  {
    planetId: "TOI-5205 b",
    starName: "TOI-5205",
    discoveredBy: "TESS AI Model",
    timeAgo: "2h ago",
    aiConfidence: 94,
    planetType: "Super-Earth",
    habitableZone: true,
    temperature: 288,
    distance: 180.7,
    lightCurve: "https://images.unsplash.com/photo-1729722615809-45b3f2ad1747?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMHRlbGVzY29wZSUyMHN0YXJzJTIwbmVidWxhfGVufDF8fHx8MTc1OTU2MTY5MHww&ixlib=rb-4.1.0&q=80&w=1080",
    validations: 12,
    telescope: "TESS"
  },
  {
    planetId: "K2-415 b",
    starName: "K2-415",
    discoveredBy: "Kepler AI Model",
    timeAgo: "4h ago",
    aiConfidence: 87,
    planetType: "Gas Giant",
    habitableZone: false,
    temperature: 1200,
    distance: 72.3,
    lightCurve: "https://images.unsplash.com/photo-1677926405168-fa86268b7295?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwc3BhY2UlMjBnYWxheHklMjBzdGFyc3xlbnwxfHx8fDE3NTk1NjE2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    validations: 8,
    telescope: "Kepler"
  },
  {
    planetId: "JWST-2024-01c",
    starName: "TRAPPIST-1",
    discoveredBy: "JWST Deep Learning",
    timeAgo: "6h ago",
    aiConfidence: 98,
    planetType: "Earth-like",
    habitableZone: true,
    temperature: 234,
    distance: 40.7,
    lightCurve: "https://images.unsplash.com/photo-1723067553070-e51e0a7fb469?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleG9wbGFuZXQlMjBzcGFjZSUyMGFzdHJvbm9teXxlbnwxfHx8fDE3NTk1NjE2OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    validations: 24,
    telescope: "JWST"
  },
  {
    planetId: "HD 110067 f",
    starName: "HD 110067",
    discoveredBy: "TESS AI Model",
    timeAgo: "8h ago",
    aiConfidence: 76,
    planetType: "Mini-Neptune",
    habitableZone: false,
    temperature: 350,
    distance: 100.6,
    validations: 5,
    telescope: "TESS"
  },
  {
    planetId: "LHS 1140 c",
    starName: "LHS 1140",
    discoveredBy: "Spitzer Archive AI",
    timeAgo: "12h ago",
    aiConfidence: 91,
    planetType: "Rocky Planet",
    habitableZone: true,
    temperature: 230,
    distance: 48.6,
    lightCurve: "https://images.unsplash.com/photo-1517866184231-7ef94c2ea930?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWxlc2NvcGUlMjBzcGFjZXxlbnwxfHx8fDE3NTk1NjE2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    validations: 18,
    telescope: "Spitzer"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('camera'); // Start with camera as main feature
  
  // Dynamic alert count based on recent discoveries and system status
  const getAlertCount = () => {
    const recentDiscoveries = mockExoplanets.filter(planet => {
      const timeAgoHours = parseInt(planet.timeAgo.replace('h ago', ''));
      return timeAgoHours <= 4; // Alerts for discoveries in last 4 hours
    }).length;
    
    const highConfidenceAlerts = mockExoplanets.filter(planet => 
      planet.aiConfidence > 90 && planet.habitableZone
    ).length;
    
    return recentDiscoveries + highConfidenceAlerts;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'camera':
        return <CameraSkyView />;
      case 'discoveries':
        return (
          <>
            <TelescopeFeeds />
            <div className="space-y-0">
              {mockExoplanets.map((planet, index) => (
                <ExoplanetCard
                  key={`${planet.planetId}-${index}`}
                  planetId={planet.planetId}
                  starName={planet.starName}
                  discoveredBy={planet.discoveredBy}
                  timeAgo={planet.timeAgo}
                  aiConfidence={planet.aiConfidence}
                  planetType={planet.planetType}
                  habitableZone={planet.habitableZone}
                  temperature={planet.temperature}
                  distance={planet.distance}
                  lightCurve={planet.lightCurve}
                  validations={planet.validations}
                  telescope={planet.telescope}
                />
              ))}
            </div>
          </>
        );
      case 'data':
        return (
          <div className="p-4 text-center">
            <h2 className="mb-4">NASA Exoplanet Archive</h2>
            <p className="text-muted-foreground">Raw telescope data and datasets coming soon...</p>
          </div>
        );
      case 'alerts':
        return (
          <div className="p-4 space-y-4">
            <div className="text-center mb-6">
              <h2 className="mb-2">Priority Alerts</h2>
              <p className="text-muted-foreground text-sm">High-confidence discoveries and urgent validations</p>
            </div>
            
            {/* Recent High-Confidence Discoveries */}
            {mockExoplanets
              .filter(planet => planet.aiConfidence > 90 && planet.habitableZone)
              .map((planet, index) => (
                <div key={`alert-${index}`} className="space-card p-4 border-l-4 border-green-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                      HABITABLE ZONE
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                      {planet.aiConfidence}% AI Confidence
                    </Badge>
                  </div>
                  <h3 className="font-semibold">{planet.planetId}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Discovered by {planet.discoveredBy} • {planet.timeAgo}
                  </p>
                  <p className="text-sm">
                    🌡️ {planet.temperature}K • 📍 {planet.distance} light-years • 🔭 {planet.telescope}
                  </p>
                </div>
              ))}
              
            {/* System Status Alerts */}
            <div className="space-card p-4 border-l-4 border-yellow-400">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                  SYSTEM STATUS
                </Badge>
              </div>
              <h3 className="font-semibold">All Telescopes Operational</h3>
              <p className="text-sm text-muted-foreground">
                TESS, Kepler, JWST, and Spitzer data streams are active and processing normally.
              </p>
            </div>
            
            <div className="space-card p-4 border-l-4 border-blue-400">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  AI PROCESSING
                </Badge>
              </div>
              <h3 className="font-semibold">Machine Learning Analysis Complete</h3>
              <p className="text-sm text-muted-foreground">
                Processed 847,392 light curves in the last 24 hours. {mockExoplanets.length} new candidate planets identified.
              </p>
            </div>
          </div>
        );
      case 'profile':
        return <BrandingShowcase />;
      default:
        return <CameraSkyView />;
    }
  };

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Cosmic background overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-purple-950/20"></div>
      </div>
      
      <MobileHeader alertCount={getAlertCount()} />
      
      <main className="max-w-lg mx-auto relative z-10">
        {renderContent()}
      </main>
      
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}