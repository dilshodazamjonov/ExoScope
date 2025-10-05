import { useState, useEffect, useRef } from "react";
import { Compass, MapPin, Telescope, Target, Loader, AlertCircle, Camera, CameraOff } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { ExoAIAssistant } from "./ExoAIAssistant";

interface VisibleExoplanet {
  planetId: string;
  starName: string;
  distance: number;
  azimuth: number;
  altitude: number;
  planetType: string;
  habitableZone: boolean;
  magnitude: number;
  temperature?: number;
  discoveredBy?: string;
  telescope?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface OrientationData {
  azimuth: number; // 0-360 degrees (North = 0)
  altitude: number; // 0-90 degrees (0 = horizon, 90 = zenith)
  accuracy: number;
}

export function CameraSkyView() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [orientation, setOrientation] = useState<OrientationData | null>(null);
  const [visibleExoplanets, setVisibleExoplanets] = useState<VisibleExoplanet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExoplanets, setIsLoadingExoplanets] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [lastApiCall, setLastApiCall] = useState<number>(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Backend API integration
  const fetchExoplanetsFromBackend = async (lat: number, lng: number, azimuth: number, altitude: number) => {
    try {
      setIsLoadingExoplanets(true);
      setError(null);
      
      const fov = 30; // Field of view in degrees
      
      console.log(`🔭 Fetching exoplanets for: ${lat.toFixed(2)}°, ${lng.toFixed(2)}° | ${azimuth}° az, ${altitude}° alt`);
      
      const response = await fetch("http://127.0.0.1:8000/exoplanets", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          latitude: lat, 
          longitude: lng, 
          azimuth, 
          altitude, 
          fov 
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Backend response:", data);
      
      // Transform backend data to our format
      const transformedExoplanets: VisibleExoplanet[] = data.map((planet: any) => ({
        planetId: planet.name || planet.planetId || `Planet-${Math.random().toString(36).substr(2, 6)}`,
        starName: planet.star_name || planet.starName || planet.host_star || "Unknown Star",
        distance: planet.distance || planet.distance_ly || Math.random() * 1000 + 50,
        azimuth: planet.azimuth || azimuth + (Math.random() - 0.5) * 30,
        altitude: planet.altitude || altitude + (Math.random() - 0.5) * 20,
        planetType: planet.planet_type || planet.type || planet.classification || "Exoplanet",
        habitableZone: planet.habitable_zone || planet.in_habitable_zone || planet.habitable || false,
        magnitude: planet.magnitude || planet.brightness || Math.random() * 10 + 5,
        temperature: planet.temperature || planet.temp_k || (planet.habitable_zone ? 250 + Math.random() * 100 : 100 + Math.random() * 800),
        discoveredBy: planet.discovered_by || planet.discovery_method || "Space Telescope",
        telescope: planet.telescope || planet.instrument || "Unknown"
      }));
      
      setVisibleExoplanets(transformedExoplanets);
      setLastApiCall(Date.now());
      
    } catch (err) {
      console.error("❌ Backend API error:", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch exoplanet data');
      
      // Fallback to mock data if backend fails
      console.log("🔄 Using fallback mock data");
      setVisibleExoplanets(mockVisibleExoplanets);
      
    } finally {
      setIsLoadingExoplanets(false);
    }
  };

  // Mock visible exoplanets data (fallback when backend is unavailable)
  const mockVisibleExoplanets: VisibleExoplanet[] = [
    {
      planetId: "Kepler-452b",
      starName: "Kepler-452",
      distance: 1402,
      azimuth: 45,
      altitude: 30,
      planetType: "Super-Earth",
      habitableZone: true,
      magnitude: 13.4
    },
    {
      planetId: "TOI-715 b",
      starName: "TOI-715",
      distance: 137,
      azimuth: 180,
      altitude: 45,
      planetType: "Earth-like",
      habitableZone: true,
      magnitude: 12.1
    },
    {
      planetId: "HD 40307 g",
      starName: "HD 40307",
      distance: 42,
      azimuth: 270,
      altitude: 25,
      planetType: "Super-Earth",
      habitableZone: true,
      magnitude: 7.2
    }
  ];

  // Start camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use rear camera for sky pointing
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      setCameraStream(stream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.error);
      }
      
      console.log("✅ Camera stream started");
      return true;
    } catch (error) {
      console.warn("Camera access failed:", error);
      setError("Camera access denied. Using compass mode instead.");
      return false;
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setShowCamera(false);
    }
  };

  // Request location and camera permissions properly
  const requestPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 1: Request Camera Permission and start stream
      const cameraWorking = await startCamera();

      // Step 2: Request Location Permission
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser");
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve, 
          (error) => {
            console.error("Geolocation error:", error);
            // Provide more specific error messages
            switch (error.code) {
              case error.PERMISSION_DENIED:
                reject(new Error("Location permission denied. Please allow location access in your browser settings."));
                break;
              case error.POSITION_UNAVAILABLE:
                reject(new Error("Location unavailable. Check your GPS signal."));
                break;
              case error.TIMEOUT:
                reject(new Error("Location request timed out. Please try again."));
                break;
              default:
                reject(new Error("Location error occurred."));
                break;
            }
          }, 
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          }
        );
      });

      // Step 3: Request Device Orientation Permission (iOS 13+)
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission !== 'granted') {
            console.warn("Device orientation permission denied");
          } else {
            console.log("✅ Device orientation permission granted");
          }
        } catch (orientationError) {
          console.warn("Device orientation permission error:", orientationError);
        }
      }

      // Success - set real location
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      });

      setPermissionGranted(true);
      console.log("✅ All permissions granted successfully");

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.warn(`Permission request failed: ${errorMessage}`);
      setError(errorMessage);
      
      // Fallback: Ask user if they want to use demo mode
      setTimeout(() => {
        if (window.confirm("Permissions failed. Would you like to try demo mode with simulated data?")) {
          setLocation({
            latitude: 40.7128, // New York City coordinates for demo
            longitude: -74.0060,
            accuracy: 1000 // Indicate this is demo data
          });
          setPermissionGranted(true);
          setError(null);
        }
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle device orientation
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null && event.beta !== null) {
        // Convert to compass heading (0 = North, 90 = East, 180 = South, 270 = West)
        const azimuth = event.alpha;
        
        // Calculate altitude from beta (device tilt)
        // event.beta: -180 to 180 degrees
        // When phone is flat (horizontal): beta ≈ 0, altitude should be 0°
        // When phone points up (vertical): beta ≈ -90, altitude should be 90°
        const beta = event.beta;
        let altitude = 0;
        
        if (beta <= 0) {
          // Phone tilted up (negative beta = looking up)
          altitude = Math.abs(beta);
        } else {
          // Phone tilted down (positive beta = looking down)
          altitude = 0; // Below horizon, clamp to 0
        }
        
        // Clamp altitude between 0-90 degrees
        altitude = Math.max(0, Math.min(90, altitude));
        
        setOrientation({
          azimuth: Math.round(azimuth),
          altitude: Math.round(altitude),
          accuracy: event.webkitCompassAccuracy || 15
        });
      }
    };

    // Mock orientation for development/testing
    const provideMockOrientation = () => {
      console.log("Using mock orientation for testing");
      // Simulate slowly changing orientation for demo
      let mockAzimuth = 0;
      let mockAltitude = 45;
      
      const interval = setInterval(() => {
        mockAzimuth = (mockAzimuth + 2) % 360;
        mockAltitude = 45 + Math.sin(mockAzimuth * Math.PI / 180) * 20;
        
        setOrientation({
          azimuth: Math.round(mockAzimuth),
          altitude: Math.round(Math.max(0, Math.min(90, mockAltitude))),
          accuracy: 10
        });
      }, 1000);
      
      return () => clearInterval(interval);
    };

    if (permissionGranted) {
      if ('DeviceOrientationEvent' in window) {
        // Request permission for iOS 13+
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          (DeviceOrientationEvent as any).requestPermission()
            .then((response: string) => {
              if (response === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation);
              } else {
                return provideMockOrientation();
              }
            })
            .catch(() => {
              return provideMockOrientation();
            });
        } else {
          // Android and older iOS
          window.addEventListener('deviceorientation', handleOrientation);
          
          // Set up fallback for cases where orientation doesn't work
          setTimeout(() => {
            if (!orientation) {
              console.log("Device orientation not working, using mock data");
              return provideMockOrientation();
            }
          }, 3000);
        }
      } else {
        // No device orientation support, use mock
        return provideMockOrientation();
      }
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [permissionGranted]);

  // Fetch exoplanets from backend based on current orientation
  useEffect(() => {
    if (orientation && location && permissionGranted) {
      const currentTime = Date.now();
      
      // Throttle API calls - only call backend every 2 seconds
      if (currentTime - lastApiCall < 2000) {
        return;
      }
      
      const currentAzimuth = orientation.azimuth;
      const currentAltitude = orientation.altitude;
      
      // Only call backend if orientation is stable (not rapidly changing)
      const orientationTimeout = setTimeout(() => {
        fetchExoplanetsFromBackend(
          location.latitude,
          location.longitude, 
          currentAzimuth,
          currentAltitude
        );
      }, 500); // Wait 500ms for orientation to stabilize
      
      return () => clearTimeout(orientationTimeout);
    }
  }, [orientation?.azimuth, orientation?.altitude, location, permissionGranted]);

  const getCompassDirection = (azimuth: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(azimuth / 45) % 8];
  };

  const getDistance = (planet: VisibleExoplanet) => {
    if (!orientation) return null;
    const angleDiff = Math.abs(planet.azimuth - orientation.azimuth);
    const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);
    return normalizedDiff;
  };

  if (!permissionGranted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
          <Telescope className="h-10 w-10 text-white" />
        </div>
        <h2 className="mb-4">ExoScope Camera</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Point your device at the sky to discover which exoplanets are visible in your current viewing direction
        </p>
        <Button 
          onClick={requestPermissions} 
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          Start ExoScope Camera
        </Button>
        {error && (
          <Alert className="mt-4 max-w-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Sky Compass Header */}
      <Card className="p-4 space-card bg-gradient-to-br from-blue-950/30 to-purple-950/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            <span className="font-semibold">Sky Direction</span>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Target className="h-3 w-3" />
            Live
          </Badge>
        </div>
        
        {orientation && location ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Direction:</span>
                <div className="font-semibold">{orientation.azimuth}° {getCompassDirection(orientation.azimuth)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Altitude:</span>
                <div className="font-semibold">{orientation.altitude}° {orientation.altitude === 90 ? '(Zenith)' : orientation.altitude === 0 ? '(Horizon)' : ''}</div>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Location:</span>
                <div className="font-semibold">{location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°</div>
              </div>
              {isLoadingExoplanets && (
                <div className="col-span-2 flex items-center gap-2 text-blue-400">
                  <Loader className="h-3 w-3 animate-spin" />
                  <span className="text-xs">Scanning sky for exoplanets...</span>
                </div>
              )}
            </div>
            
            {/* System Status indicators */}
            <div className="flex items-center gap-4 pt-2 border-t border-white/10">
              <div className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${location.accuracy > 500 ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                <span className="text-xs text-muted-foreground">
                  {location.accuracy > 500 ? 'Mock GPS' : 'GPS Active'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${orientation.accuracy > 50 ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                <span className="text-xs text-muted-foreground">
                  {orientation.accuracy > 50 ? 'Simulated' : 'Live Sensors'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${error ? 'bg-red-400' : visibleExoplanets.length > 0 ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                <span className="text-xs text-muted-foreground">
                  {error ? 'Backend Error' : visibleExoplanets.length > 0 ? 'API Connected' : 'Searching...'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader className="h-4 w-4 animate-spin" />
            Calibrating compass...
          </div>
        )}
      </Card>

      {/* Camera View or Sky Compass */}
      <Card className="p-0 space-card overflow-hidden">
        <div className="relative w-full h-80 bg-gradient-to-b from-slate-950 via-blue-950 to-purple-950 overflow-hidden">
          {/* Live Camera Feed */}
          {showCamera && cameraStream ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
            </>
          ) : (
            /* Fallback Sky Compass */
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-purple-950 cosmic-glow"></div>
          )}
          
          {/* Camera Toggle Button */}
          <div className="absolute top-4 left-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={showCamera ? stopCamera : startCamera}
              className="gap-1 bg-black/50 backdrop-blur-sm border-white/20"
            >
              {showCamera ? <CameraOff className="h-3 w-3" /> : <Camera className="h-3 w-3" />}
              {showCamera ? 'Stop' : 'Camera'}
            </Button>
          </div>
          
          {/* Horizon line - positioned based on camera altitude */}
          {orientation && (
            <>
              <div 
                className="absolute left-0 right-0 h-0.5 bg-white/70 shadow-lg"
                style={{ bottom: `${(orientation.altitude / 90) * 60}%` }}
              ></div>
              <div 
                className="absolute left-4 text-white text-xs bg-black/50 px-1 rounded backdrop-blur-sm"
                style={{ bottom: `${(orientation.altitude / 90) * 60 + 2}%` }}
              >
                Horizon
              </div>
            </>
          )}
          
          {/* Direction and altitude indicators */}
          {orientation && (
            <>
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-semibold border border-white/20">
                  {orientation.azimuth}° {getCompassDirection(orientation.azimuth)}
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-blue-500/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-white border border-white/30">
                  ↗ {orientation.altitude}°
                </div>
              </div>
            </>
          )}
          
          {/* AR Exoplanet Overlays */}
          {visibleExoplanets.map((planet) => {
            const distance = getDistance(planet);
            if (distance === null || !orientation) return null;
            
            // Position on screen based on relative angle and altitude
            const relativeAngle = planet.azimuth - orientation.azimuth;
            const normalizedAngle = ((relativeAngle + 180) % 360) - 180;
            const xPos = 50 + (normalizedAngle / 45) * 25; // ±25% from center for ±45°
            
            // Position based on altitude relative to camera altitude
            const relativeAltitude = planet.altitude - orientation.altitude;
            const yPos = 50 - (relativeAltitude / 30) * 30; // Center screen ± 30% for ±30° altitude difference
            
            return (
              <div
                key={planet.planetId}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ left: `${Math.max(10, Math.min(90, xPos))}%`, top: `${Math.max(15, Math.min(75, yPos))}%` }}
              >
                <div className="relative">
                  {/* Planet Marker */}
                  <div className={`w-4 h-4 rounded-full ${
                    planet.habitableZone 
                      ? 'bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6)] border-2 border-green-300' 
                      : 'bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.6)] border-2 border-blue-300'
                  } animate-pulse`}></div>
                  
                  {/* Planet Info Label */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-white/30 shadow-lg">
                    <div className="font-semibold">{planet.planetId}</div>
                    <div className="text-xs text-gray-300">{planet.distance} ly • {planet.planetType}</div>
                  </div>
                  
                  {/* Direction Line */}
                  <div className="absolute top-2 left-2 w-8 h-0.5 bg-white/60 transform rotate-45"></div>
                </div>
              </div>
            );
          })}
          
          {/* Camera Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              <div className="w-6 h-6 border-2 border-white/60 rounded-full"></div>
              <div className="absolute inset-0 w-6 h-6">
                <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-white/60 transform -translate-x-1/2 -translate-y-1"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-white/60 transform -translate-x-1/2 translate-y-1"></div>
                <div className="absolute left-0 top-1/2 w-2 h-0.5 bg-white/60 transform -translate-y-1/2 -translate-x-1"></div>
                <div className="absolute right-0 top-1/2 w-2 h-0.5 bg-white/60 transform -translate-y-1/2 translate-x-1"></div>
              </div>
            </div>
          </div>
          
          {/* Status Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 border border-white/20">
              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${showCamera ? 'bg-red-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span>{showCamera ? 'LIVE AR' : 'COMPASS'}</span>
                  {isLoadingExoplanets && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                      <span>SCANNING</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span>🌌 {visibleExoplanets.length} planets</span>
                  <span className={error ? 'text-red-300' : 'text-green-300'}>
                    {error ? 'OFFLINE' : 'API'}
                  </span>
                  {location && (
                    <span className={location.accuracy > 500 ? 'text-yellow-300' : 'text-green-300'}>
                      {location.accuracy > 500 ? 'DEMO' : 'GPS'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Visible Exoplanets List */}
      <div className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Target className="h-4 w-4" />
          Exoplanets in View ({visibleExoplanets.length})
        </h3>
        
        {visibleExoplanets.length === 0 ? (
          <Card className="p-4 text-center text-muted-foreground space-card">
            <Telescope className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No exoplanets visible in this direction</p>
            <p className="text-sm">Try pointing your device in a different direction</p>
          </Card>
        ) : (
          visibleExoplanets.map((planet) => (
            <Card key={planet.planetId} className="p-4 space-card">{planet.habitableZone && " planet-glow"}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{planet.planetId}</h4>
                  <p className="text-sm text-muted-foreground">Orbiting {planet.starName}</p>
                </div>
                <Badge variant={planet.habitableZone ? "default" : "secondary"}>
                  {planet.habitableZone ? "Habitable" : planet.planetType}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                <div>
                  <span className="text-muted-foreground">Distance:</span>
                  <div className="font-medium">{planet.distance.toFixed(1)} ly</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Direction:</span>
                  <div className="font-medium">{Math.round(planet.azimuth)}° {getCompassDirection(planet.azimuth)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Altitude:</span>
                  <div className="font-medium">{Math.round(planet.altitude)}° {planet.altitude >= 80 ? '(High)' : planet.altitude >= 45 ? '(Mid)' : '(Low)'}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Temperature:</span>
                  <div className="font-medium">{planet.temperature ? `${Math.round(planet.temperature)}K` : 'Unknown'}</div>
                </div>
              </div>
              {(planet.telescope || planet.discoveredBy) && (
                <div className="text-xs text-muted-foreground pt-1 border-t border-white/10">
                  {planet.telescope && `🔭 ${planet.telescope}`}
                  {planet.telescope && planet.discoveredBy && ' • '}
                  {planet.discoveredBy && `📡 ${planet.discoveredBy}`}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
      
      {/* Instructions */}
      <Card className="p-4 space-card bg-gradient-to-r from-blue-950/20 to-purple-950/20">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Target className="h-4 w-4" />
          How to Use ExoScope
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 📱 Hold your device up and point it at the sky</li>
          <li>• 🔄 Tilt up/down to change altitude (0° = horizon, 90° = zenith)</li>
          <li>• 🧭 Rotate left/right to scan different compass directions</li>
          <li>• 🌱 Green dots = planets in habitable zones (life possible!)</li>
          <li>• 🔵 Blue dots = other confirmed exoplanets</li>
          <li>• 📡 Real-time data from NASA exoplanet backend API</li>
          <li>• 🎯 AR overlays show exact sky positions of real planets</li>
          <li>• 🤖 Tap the AI assistant for detailed planet analysis</li>
          <li>• 🟡 Yellow status = Demo/fallback data when backend offline</li>
          <li>• 🟢 Green status = Live GPS + Backend API connected</li>
        </ul>
      </Card>
      
      {/* AI Assistant */}
      <ExoAIAssistant 
        visibleExoplanets={visibleExoplanets.map(planet => ({
          ...planet,
          temperature: planet.planetType === "Super-Earth" ? 288 : 
                      planet.planetType === "Gas Giant" ? 1200 : 
                      planet.habitableZone ? 250 : 450
        }))}
        currentOrientation={orientation}
      />
    </div>
  );
}