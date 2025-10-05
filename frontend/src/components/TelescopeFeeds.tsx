import { Satellite, Eye, RadioIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface TelescopeFeed {
  id: string;
  name: string;
  mission: string;
  status: 'active' | 'standby' | 'processing';
  newCandidates: number;
  image: string;
}

const telescopeFeeds: TelescopeFeed[] = [
  { 
    id: "kepler", 
    name: "Kepler", 
    mission: "K2",
    status: 'processing', 
    newCandidates: 12,
    image: "https://images.unsplash.com/photo-1729722615809-45b3f2ad1747?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMHRlbGVzY29wZSUyMHN0YXJzJTIwbmVidWxhfGVufDF8fHx8MTc1OTU2MTY5MHww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    id: "tess", 
    name: "TESS", 
    mission: "Sector 74",
    status: 'active', 
    newCandidates: 8,
    image: "https://images.unsplash.com/photo-1517866184231-7ef94c2ea930?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWxlc2NvcGUlMjBzcGFjZXxlbnwxfHx8fDE3NTk1NjE2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    id: "jwst", 
    name: "JWST", 
    mission: "Cycle 3",
    status: 'active', 
    newCandidates: 5,
    image: "https://images.unsplash.com/photo-1677926405168-fa86268b7295?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwc3BhY2UlMjBnYWxheHklMjBzdGFyc3xlbnwxfHx8fDE3NTk1NjE2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    id: "spitzer", 
    name: "Spitzer", 
    mission: "Archive",
    status: 'standby', 
    newCandidates: 0,
    image: "https://images.unsplash.com/photo-1723067553070-e51e0a7fb469?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleG9wbGFuZXQlMjBzcGFjZSUyMGFzdHJvbm9teXxlbnwxfHx8fDE3NTk1NjE2OTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500';
    case 'processing': return 'bg-blue-500';
    case 'standby': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

const getStatusIcon = (name: string) => {
  if (name === 'JWST') return <Eye className="h-3 w-3" />;
  if (name === 'TESS') return <RadioIcon className="h-3 w-3" />;
  return <Satellite className="h-3 w-3" />;
};

export function TelescopeFeeds() {
  return (
    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-950/30 to-purple-950/30 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Active Missions</h2>
        <Badge variant="secondary" className="text-xs">Live Data</Badge>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {telescopeFeeds.map((feed) => (
          <div key={feed.id} className="flex flex-col items-center gap-2 min-w-0">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-offset-2 ring-primary/20">
                <ImageWithFallback
                  src={feed.image}
                  alt={feed.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`absolute -bottom-1 -right-1 h-6 w-6 ${getStatusColor(feed.status)} rounded-full flex items-center justify-center text-white`}>
                {getStatusIcon(feed.name)}
              </div>
              {feed.newCandidates > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                  {feed.newCandidates}
                </Badge>
              )}
            </div>
            <div className="text-center">
              <span className="text-xs font-medium block">{feed.name}</span>
              <span className="text-xs text-muted-foreground">{feed.mission}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}