import { Brain, TrendingUp, MapPin, Clock, Star, Thermometer } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ExoplanetCardProps {
  planetId: string;
  starName: string;
  discoveredBy: string;
  timeAgo: string;
  aiConfidence: number;
  planetType: string;
  habitableZone: boolean;
  temperature: number;
  distance: number;
  lightCurve?: string;
  validations: number;
  telescope: string;
}

export function ExoplanetCard({ 
  planetId, 
  starName, 
  discoveredBy, 
  timeAgo, 
  aiConfidence, 
  planetType, 
  habitableZone, 
  temperature, 
  distance, 
  lightCurve, 
  validations,
  telescope 
}: ExoplanetCardProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600 dark:text-green-400";
    if (confidence >= 75) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 90) return "High";
    if (confidence >= 75) return "Medium";
    return "Low";
  };

  return (
    <Card className="border-0 border-b rounded-none">
      <div className="p-4">
        {/* Discovery Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <Brain className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{planetId}</h3>
                <Badge variant={habitableZone ? "default" : "secondary"} className="text-xs">
                  {habitableZone ? "Habitable Zone" : planetType}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Orbiting {starName} • {timeAgo}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {telescope}
          </Badge>
        </div>

        {/* AI Confidence */}
        <div className="mb-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI Confidence</span>
            </div>
            <span className={`text-sm font-semibold ${getConfidenceColor(aiConfidence)}`}>
              {aiConfidence}% {getConfidenceLabel(aiConfidence)}
            </span>
          </div>
          <Progress value={aiConfidence} className="h-2" />
        </div>

        {/* Planet Stats */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <span>{temperature}K</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span>{distance} ly</span>
          </div>
        </div>

        {/* Light Curve */}
        {lightCurve && (
          <div className="mb-3 -mx-4">
            <div className="px-4 pb-2">
              <span className="text-sm font-medium">Transit Light Curve</span>
            </div>
            <ImageWithFallback 
              src={lightCurve} 
              alt="Light curve data" 
              className="w-full h-32 object-cover bg-gradient-to-r from-blue-900 to-purple-900"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2 p-0 h-auto">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">{validations} validations</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 p-0 h-auto">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Analyze</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}