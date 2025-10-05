import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface Story {
  id: string;
  username: string;
  avatar: string;
  isViewed?: boolean;
}

const stories: Story[] = [
  { id: "your-story", username: "Your Story", avatar: "", isViewed: false },
  { id: "1", username: "sarah_j", avatar: "https://images.unsplash.com/photo-1639422633773-041d9fa609af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMHByb2ZpbGUlMjBwb3J0cmFpdHN8ZW58MXx8fHwxNTk1NjE0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080", isViewed: false },
  { id: "2", username: "mike_travel", avatar: "https://images.unsplash.com/flagged/photo-1579291585422-1d686ff79001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NTk0NjgyNDh8MA&ixlib=rb-4.1.0&q=80&w=1080", isViewed: true },
  { id: "3", username: "foodie_emma", avatar: "https://images.unsplash.com/photo-1681770187839-29d14a415dc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHklMjBkZWxpY2lvdXN8ZW58MXx8fHwxNzU5NTA3ODE1fDA&ixlib=rb-4.1.0&q=80&w=1080", isViewed: false },
  { id: "4", username: "nature_lover", avatar: "https://images.unsplash.com/photo-1729011373667-cc344d939de6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NTk1MTYxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080", isViewed: true }
];

export function StoryCarousel() {
  return (
    <div className="p-4 border-b">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-1 min-w-0">
            <div className={`relative ${story.isViewed ? 'opacity-60' : ''}`}>
              {story.id === "your-story" ? (
                <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-dashed border-muted-foreground">
                    <AvatarFallback>
                      <Plus className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Avatar className={`h-16 w-16 ring-2 ${story.isViewed ? 'ring-muted' : 'ring-primary'} ring-offset-2`}>
                  <AvatarImage src={story.avatar} alt={story.username} />
                  <AvatarFallback>{story.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
            </div>
            <span className="text-xs text-center max-w-16 truncate">
              {story.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}