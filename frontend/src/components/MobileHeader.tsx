import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExoScopeLogo } from "./ExoScopeLogo";

interface MobileHeaderProps {
  alertCount?: number;
}

export function MobileHeader({ alertCount = 0 }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-black/40">
      <div className="flex h-16 items-center justify-between px-4">
        <ExoScopeLogo size="md" showText={true} showBadge={true} />
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 relative">
            <Bell className="h-5 w-5" />
            {alertCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                {alertCount > 99 ? '99+' : alertCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}