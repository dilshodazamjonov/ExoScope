import { Home, Camera, Database, AlertTriangle, User } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around py-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-12 w-12 flex-col gap-1 ${activeTab === 'discoveries' ? 'text-primary' : ''}`}
          onClick={() => onTabChange('discoveries')}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs">Discoveries</span>
        </Button>
        
        {/* Main Camera Button - Prominent Design */}
        <Button 
          variant={activeTab === 'camera' ? 'default' : 'outline'}
          size="icon" 
          className={`h-16 w-16 rounded-full flex-col gap-1 ${
            activeTab === 'camera' 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110' 
              : 'border-2 border-primary/20'
          }`}
          onClick={() => onTabChange('camera')}
        >
          <Camera className="h-8 w-8" />
          <span className="text-xs font-semibold">ExoScope</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-12 w-12 flex-col gap-1 ${activeTab === 'data' ? 'text-primary' : ''}`}
          onClick={() => onTabChange('data')}
        >
          <Database className="h-6 w-6" />
          <span className="text-xs">Data</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-12 w-12 flex-col gap-1 relative ${activeTab === 'alerts' ? 'text-primary' : ''}`}
          onClick={() => onTabChange('alerts')}
        >
          <AlertTriangle className="h-6 w-6" />
          <span className="text-xs">Alerts</span>
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
            7
          </Badge>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-12 w-12 flex-col gap-1 ${activeTab === 'profile' ? 'text-primary' : ''}`}
          onClick={() => onTabChange('profile')}
        >
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </nav>
  );
}