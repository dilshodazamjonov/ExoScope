import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Bot, MessageCircle, X, Zap, Target, Thermometer, Globe, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ExoplanetData {
  planetId: string;
  starName: string;
  planetType: string;
  habitableZone: boolean;
  temperature: number;
  distance: number;
  azimuth: number;
  altitude: number;
  aiConfidence?: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  planetContext?: ExoplanetData;
}

interface ExoAIAssistantProps {
  visibleExoplanets: ExoplanetData[];
  currentOrientation?: {
    azimuth: number;
    altitude: number;
  };
}

export function ExoAIAssistant({ visibleExoplanets, currentOrientation }: ExoAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPlanet, setCurrentPlanet] = useState<ExoplanetData | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Auto-select the closest planet to user's viewing direction
  useEffect(() => {
    if (visibleExoplanets.length > 0 && currentOrientation) {
      const closest = visibleExoplanets.reduce((prev, current) => {
        const prevDist = Math.abs(prev.azimuth - currentOrientation.azimuth) + 
                        Math.abs(prev.altitude - currentOrientation.altitude);
        const currentDist = Math.abs(current.azimuth - currentOrientation.azimuth) + 
                           Math.abs(current.altitude - currentOrientation.altitude);
        return currentDist < prevDist ? current : prev;
      });
      setCurrentPlanet(closest);
    } else {
      setCurrentPlanet(null);
    }
  }, [visibleExoplanets, currentOrientation]);

  // AI analysis animation
  useEffect(() => {
    if (isOpen && currentPlanet) {
      setAnalysisStep(0);
      const interval = setInterval(() => {
        setAnalysisStep(prev => (prev + 1) % 4);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen, currentPlanet]);

  const getHabitabilityAnalysis = (planet: ExoplanetData) => {
    if (planet.habitableZone) {
      return {
        status: "Potentially Habitable",
        confidence: 85,
        factors: [
          "Located in circumstellar habitable zone",
          "Temperature suitable for liquid water",
          "Rocky planet composition likely"
        ],
        color: "text-green-400"
      };
    } else {
      return {
        status: planet.temperature > 800 ? "Too Hot" : "Too Cold",
        confidence: 92,
        factors: [
          planet.temperature > 800 ? "Extreme temperature detected" : "Below freezing point",
          "Outside habitable zone",
          "Unlikely to support liquid water"
        ],
        color: "text-red-400"
      };
    }
  };

  const analysisSteps = [
    { icon: Target, text: "Analyzing telescope data...", color: "text-blue-400" },
    { icon: Thermometer, text: "Calculating atmospheric conditions...", color: "text-orange-400" },
    { icon: Globe, text: "Assessing habitability factors...", color: "text-green-400" },
    { icon: Zap, text: "AI analysis complete!", color: "text-purple-400" }
  ];

  // Generate AI responses based on user questions
  const generateAIResponse = (question: string, planet?: ExoplanetData): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (planet) {
      if (lowerQuestion.includes('habitable') || lowerQuestion.includes('life')) {
        return planet.habitableZone 
          ? `${planet.planetId} is located in the habitable zone of ${planet.starName}! With a temperature of ${planet.temperature}K, it could potentially support liquid water. This makes it a prime candidate for further study in our search for extraterrestrial life.`
          : `${planet.planetId} is unfortunately outside the habitable zone. At ${planet.temperature}K, it's ${planet.temperature > 800 ? 'too hot' : 'too cold'} for liquid water to exist on its surface. However, it still provides valuable data about planetary formation!`;
      }
      
      if (lowerQuestion.includes('distance') || lowerQuestion.includes('far')) {
        return `${planet.planetId} is approximately ${planet.distance} light-years away from Earth. To put that in perspective, it would take our fastest spacecraft about ${Math.round(planet.distance * 18000)} years to reach it!`;
      }
      
      if (lowerQuestion.includes('temperature') || lowerQuestion.includes('hot') || lowerQuestion.includes('cold')) {
        const celsius = Math.round(planet.temperature - 273.15);
        return `The surface temperature of ${planet.planetId} is approximately ${planet.temperature}K (${celsius}°C). ${planet.temperature > 800 ? 'This extreme heat would vaporize most materials!' : planet.temperature < 200 ? 'This is extremely cold - colder than Antarctica!' : 'This temperature is within a range that could support certain forms of life.'}`;
      }
      
      if (lowerQuestion.includes('type') || lowerQuestion.includes('what is')) {
        return `${planet.planetId} is classified as a ${planet.planetType}. ${planet.planetType === 'Super-Earth' ? 'Super-Earths are rocky planets larger than Earth but smaller than Neptune - they\'re some of our best candidates for finding life!' : planet.planetType === 'Gas Giant' ? 'Gas giants are massive planets composed mainly of hydrogen and helium, similar to Jupiter in our solar system.' : 'Rocky planets have solid surfaces and are the most likely to support life as we know it.'}`;
      }
    }
    
    // General astronomy questions
    if (lowerQuestion.includes('how') && lowerQuestion.includes('find')) {
      return "We discover exoplanets using several methods: the transit method (detecting dimming when a planet passes in front of its star), radial velocity (measuring star wobble), and direct imaging. Our AI analyzes light curves from space telescopes like TESS and Kepler to identify potential planets!";
    }
    
    if (lowerQuestion.includes('telescope') || lowerQuestion.includes('tess') || lowerQuestion.includes('kepler')) {
      return "ExoScope integrates data from multiple space telescopes! TESS scans the entire sky for transiting planets, Kepler discovered thousands of exoplanets, JWST provides detailed atmospheric analysis, and Spitzer gave us infrared insights. Together, they've revolutionized exoplanet science!";
    }
    
    if (lowerQuestion.includes('ai') || lowerQuestion.includes('machine learning')) {
      return "Our AI uses deep learning neural networks trained on millions of light curves to detect planetary transits that might be missed by traditional algorithms. The AI can identify subtle patterns in stellar brightness that indicate the presence of exoplanets with over 95% accuracy!";
    }
    
    if (lowerQuestion.includes('earth') || lowerQuestion.includes('similar')) {
      return "We've found several Earth-like exoplanets! The most promising candidates are rocky planets in the habitable zone of their stars. Some notable examples include Proxima Centauri b (closest to us), TRAPPIST-1e (in a multi-planet system), and Kepler-452b (most Earth-like in size and orbit).";
    }
    
    // Default helpful response
    return `Great question! I'm here to help you explore the cosmos. Try asking me about:\n• The planets currently visible in your view\n• How we discover exoplanets\n• What makes a planet habitable\n• Our space telescopes and AI technology\n• Specific planet characteristics like temperature or distance`;
  };

  // Handle sending a message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(inputMessage, currentPlanet || undefined),
        timestamp: new Date(),
        planetContext: currentPlanet || undefined
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Initialize with welcome message
  useEffect(() => {
    if (chatMode && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `Welcome to ExoScope AI! I'm your personal exoplanet discovery assistant. ${currentPlanet ? `I can see you're looking at ${currentPlanet.planetId} - ` : ''}Ask me anything about the planets you discover, our search methods, or space exploration in general!`,
        timestamp: new Date()
      }]);
    }
  }, [chatMode, currentPlanet, messages.length]);

  if (visibleExoplanets.length === 0) {
    return (
      <div className="fixed bottom-24 right-4 z-50">
        <Card className="p-3 space-card max-w-xs">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bot className="h-4 w-4" />
            <span>No exoplanets in view. Try pointing your device at different areas of the sky!</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <AnimatePresence>
        {isOpen && currentPlanet ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4"
          >
            <Card className="w-80 space-card">
              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center cosmic-glow">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">ExoScope AI</div>
                      <div className="text-xs text-muted-foreground">
                        {chatMode ? 'Chat Assistant' : 'Real-time Analysis'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => setChatMode(!chatMode)}
                      title={chatMode ? 'Switch to Analysis' : 'Switch to Chat'}
                    >
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Chat Mode */}
                {chatMode ? (
                  <div className="space-y-3">
                    {/* Chat Messages */}
                    <ScrollArea className="h-64 w-full rounded border border-white/10 p-2">
                      <div className="space-y-3">
                        {messages.map((message) => (
                          <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-2 text-xs ${
                              message.role === 'user' 
                                ? 'bg-blue-500 text-white ml-auto' 
                                : 'bg-white/10 text-foreground'
                            }`}>
                              <div className="flex items-center gap-1 mb-1">
                                {message.role === 'user' ? (
                                  <User className="h-3 w-3" />
                                ) : (
                                  <Bot className="h-3 w-3" />
                                )}
                                <span className="font-medium">
                                  {message.role === 'user' ? 'You' : 'ExoScope AI'}
                                </span>
                              </div>
                              <div className="whitespace-pre-wrap">{message.content}</div>
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex gap-2 justify-start">
                            <div className="bg-white/10 rounded-lg p-2 text-xs">
                              <div className="flex items-center gap-1 mb-1">
                                <Bot className="h-3 w-3" />
                                <span className="font-medium">ExoScope AI</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="flex gap-1">
                                  <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="text-muted-foreground">thinking...</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    {/* Chat Input */}
                    <div className="flex gap-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask about exoplanets..."
                        className="text-xs"
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button 
                        size="icon" 
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="h-8 w-8"
                      >
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Analysis Steps */}
                    <div className="space-y-2 mb-4">
                      {analysisSteps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isActive = analysisStep === index;
                        const isComplete = analysisStep > index;
                        
                        return (
                          <div 
                            key={index}
                            className={`flex items-center gap-2 text-xs transition-all duration-300 ${
                              isActive ? step.color : isComplete ? "text-green-400" : "text-muted-foreground"
                            }`}
                          >
                            <StepIcon className={`h-3 w-3 ${isActive ? "animate-pulse" : ""}`} />
                            <span>{step.text}</span>
                            {isComplete && <span className="text-green-400">✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Planet Analysis */}
                {analysisStep >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="border-t border-white/10 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{currentPlanet.planetId}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {currentPlanet.planetType}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mb-2">
                        Orbiting {currentPlanet.starName} • {currentPlanet.distance} light-years away
                      </div>

                      {/* Habitability Assessment */}
                      <div className="bg-black/20 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Habitability Assessment</span>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getHabitabilityAnalysis(currentPlanet).color}`}
                          >
                            {getHabitabilityAnalysis(currentPlanet).confidence}% confidence
                          </Badge>
                        </div>
                        
                        <div className={`font-semibold text-sm ${getHabitabilityAnalysis(currentPlanet).color}`}>
                          {getHabitabilityAnalysis(currentPlanet).status}
                        </div>

                        <div className="space-y-1">
                          {getHabitabilityAnalysis(currentPlanet).factors.map((factor, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="h-1 w-1 bg-current rounded-full"></div>
                              <span>{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Stats */}
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="bg-black/20 rounded-lg p-2">
                          <div className="text-xs text-muted-foreground">Temperature</div>
                          <div className="font-semibold text-sm">{currentPlanet.temperature}K</div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-2">
                          <div className="text-xs text-muted-foreground">Distance</div>
                          <div className="font-semibold text-sm">{currentPlanet.distance} ly</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Floating AI Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 cosmic-glow relative"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="bot"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Bot className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Notification dot for new discoveries */}
          {visibleExoplanets.length > 0 && !isOpen && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
          )}
        </Button>
      </motion.div>
    </div>
  );
}