import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Pause, Play } from "lucide-react";

const mockReels = [
  {
    id: "1",
    video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
    user: { display_name: "CreatorOne", avatar_url: null },
    caption: "Amazing sunset vibes 🌅 #nature #sunset",
    likes: 1234,
    comments: 56,
  },
  {
    id: "2",
    video_url: "https://www.w3schools.com/html/movie.mp4",
    user: { display_name: "TechGuru", avatar_url: null },
    caption: "Quick coding tip! 💻 #coding #tech",
    likes: 892,
    comments: 34,
  },
  {
    id: "3",
    video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
    user: { display_name: "FitnessCoach", avatar_url: null },
    caption: "Morning workout routine 💪 #fitness #health",
    likes: 2456,
    comments: 128,
  },
];

const ReelCard = ({ reel, isActive }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative h-full w-full bg-black snap-start snap-always">
      <video
        ref={videoRef}
        src={reel.video_url}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
      />

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Play className="h-16 w-16 text-white" />
        </div>
      )}

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-16 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={reel.user.avatar_url} />
            <AvatarFallback>{reel.user.display_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-white">{reel.user.display_name}</p>
          </div>
          <Button size="sm" variant="outline" className="ml-2 bg-transparent border-white text-white hover:bg-white/20">
            Follow
          </Button>
        </div>
        <p className="text-white text-sm">{reel.caption}</p>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-6">
        <button
          onClick={() => setLiked(!liked)}
          className="flex flex-col items-center gap-1"
        >
          <div className={`p-3 rounded-full bg-black/40 ${liked ? "text-red-500" : "text-white"}`}>
            <Heart className={`h-6 w-6 ${liked ? "fill-current" : ""}`} />
          </div>
          <span className="text-white text-xs">{liked ? reel.likes + 1 : reel.likes}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-full bg-black/40 text-white">
            <MessageCircle className="h-6 w-6" />
          </div>
          <span className="text-white text-xs">{reel.comments}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-full bg-black/40 text-white">
            <Share2 className="h-6 w-6" />
          </div>
          <span className="text-white text-xs">Share</span>
        </button>

        <button onClick={toggleMute} className="p-3 rounded-full bg-black/40 text-white">
          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
};

const Reels = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      setActiveIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-screen w-full bg-black overflow-hidden">
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {mockReels.map((reel, index) => (
          <div key={reel.id} className="h-full w-full">
            <ReelCard reel={reel} isActive={index === activeIndex} />
          </div>
        ))}
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
        <h1 className="text-xl font-bold text-white">Reels</h1>
        <Badge variant="secondary" className="bg-white/20 text-white">
          {activeIndex + 1} / {mockReels.length}
        </Badge>
      </div>
    </div>
  );
};

export default Reels;
