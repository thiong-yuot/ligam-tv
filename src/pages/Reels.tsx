import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ChevronUp, 
  ChevronDown, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Home
} from "lucide-react";
import { useDiscoveryContent } from "@/hooks/useDiscoveryContent";

const Reels = () => {
  const navigate = useNavigate();
  const { data: allContent } = useDiscoveryContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const videos = allContent?.filter(c => c.content_type === 'video') || [];

  const goToNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const toggleLike = (id: string) => {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id: string) => {
    setSaved(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        goToNext();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.key === "m") {
        setIsMuted(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, videos.length]);

  // Touch/swipe handling
  useEffect(() => {
    let startY = 0;
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY;
      const diff = startY - endY;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToNext();
        else goToPrev();
      }
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex, videos.length]);

  const currentVideo = videos[currentIndex];

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">No Reels Yet</h2>
          <p className="text-muted-foreground mb-6">Check back later for new content</p>
          <Button onClick={() => navigate("/discovery")} variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Back to Discovery
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-black relative overflow-hidden"
    >
      {/* Eelai Home Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 bg-black/40 backdrop-blur-md hover:bg-black/60 text-white border border-white/10"
        onClick={() => navigate("/discovery")}
      >
        <Sparkles className="w-5 h-5" />
      </Button>

      {/* Navigation Arrows */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/40 backdrop-blur-md hover:bg-black/60 text-white border border-white/10 disabled:opacity-30"
          onClick={goToPrev}
          disabled={currentIndex === 0}
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/40 backdrop-blur-md hover:bg-black/60 text-white border border-white/10 disabled:opacity-30"
          onClick={goToNext}
          disabled={currentIndex === videos.length - 1}
        >
          <ChevronDown className="w-5 h-5" />
        </Button>
      </div>

      {/* Video Counter */}
      <div className="fixed top-4 right-4 z-50 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-sm border border-white/10">
        {currentIndex + 1} / {videos.length}
      </div>

      {/* Main Video Display */}
      <div className="h-screen flex items-center justify-center">
        <div className="relative w-full max-w-md mx-auto h-full flex items-center">
          {/* Video/Image Content */}
          <div 
            className="relative w-full aspect-[9/16] max-h-[90vh] bg-slate-900 rounded-xl overflow-hidden mx-4"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {currentVideo?.thumbnail_url ? (
              <img 
                src={currentVideo.thumbnail_url} 
                alt={currentVideo.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                <span className="text-8xl">🎬</span>
              </div>
            )}

            {/* Play/Pause Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            )}

            {/* Bottom Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

            {/* Video Info */}
            <div className="absolute bottom-4 left-4 right-16 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-8 h-8 border-2 border-primary">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xs">
                    <Sparkles className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm">Eelai Discovery</span>
              </div>
              <h3 className="font-medium text-sm mb-1 line-clamp-2">{currentVideo?.title}</h3>
              {currentVideo?.summary && (
                <p className="text-xs text-white/70 line-clamp-2">{currentVideo.summary}</p>
              )}
              {currentVideo?.duration_minutes && (
                <p className="text-xs text-white/50 mt-1">{currentVideo.duration_minutes} min</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute right-6 bottom-1/4 flex flex-col gap-6">
            <button
              onClick={() => toggleLike(currentVideo?.id || '')}
              className="flex flex-col items-center gap-1 text-white"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                likes[currentVideo?.id || ''] 
                  ? 'bg-red-500' 
                  : 'bg-black/40 backdrop-blur-sm'
              }`}>
                <Heart className={`w-5 h-5 ${likes[currentVideo?.id || ''] ? 'fill-white' : ''}`} />
              </div>
              <span className="text-xs">{(currentVideo?.view_count || 0) + (likes[currentVideo?.id || ''] ? 1 : 0)}</span>
            </button>

            <button className="flex flex-col items-center gap-1 text-white">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-xs">Chat</span>
            </button>

            <button
              onClick={() => toggleSave(currentVideo?.id || '')}
              className="flex flex-col items-center gap-1 text-white"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                saved[currentVideo?.id || ''] 
                  ? 'bg-primary' 
                  : 'bg-black/40 backdrop-blur-sm'
              }`}>
                <Bookmark className={`w-5 h-5 ${saved[currentVideo?.id || ''] ? 'fill-white' : ''}`} />
              </div>
              <span className="text-xs">Save</span>
            </button>

            <button className="flex flex-col items-center gap-1 text-white">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-xs">Share</span>
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex flex-col items-center gap-1 text-white"
            >
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-50">
        {videos.slice(0, 10).map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all ${
              idx === currentIndex 
                ? 'w-6 bg-white' 
                : 'w-1.5 bg-white/30'
            }`}
          />
        ))}
        {videos.length > 10 && (
          <span className="text-white/50 text-xs ml-2">+{videos.length - 10}</span>
        )}
      </div>
    </div>
  );
};

export default Reels;
