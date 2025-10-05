import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PostCardProps {
  username: string;
  avatar: string;
  timeAgo: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
}

export function PostCard({ username, avatar, timeAgo, content, image, likes, comments }: PostCardProps) {
  return (
    <Card className="border-0 border-b rounded-none">
      <div className="p-4">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatar} alt={username} />
              <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{username}</h3>
              <p className="text-sm text-muted-foreground">{timeAgo}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Post Content */}
        <p className="mb-3">{content}</p>

        {/* Post Image */}
        {image && (
          <div className="mb-3 -mx-4">
            <ImageWithFallback 
              src={image} 
              alt="Post image" 
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2 p-0 h-auto">
              <Heart className="h-5 w-5" />
              <span className="text-sm">{likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 p-0 h-auto">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{comments}</span>
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}