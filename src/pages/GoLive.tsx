import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { FeatureGate, FeatureLockedOverlay } from "@/components/FeatureGate";
import { 
  Video, 
  Copy, 
  Eye, 
  EyeOff, 
  Settings2, 
  Loader2,
  Radio,
  MonitorPlay,
  Mic,
  Camera,
  Lock,
  Crown,
  Sparkles,
  Tv,
  Palette
} from "lucide-react";

const GoLive = () => {
  const [checking, setChecking] = useState(true);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Gaming");
  const [streamQuality, setStreamQuality] = useState<"720p" | "1080p" | "4k">("720p");
  const [enableOverlay, setEnableOverlay] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasAccess, tier } = useFeatureAccess();

  // Mock stream key
  const streamKey = "live_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  const rtmpUrl = "rtmp://ingest.ligam.tv/live";

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
      setChecking(false);
    };
    checkAuth();
  }, [navigate]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const categories = [
    "Gaming", "Music", "Creative", "Talk Shows", "Coding", 
    "Fitness", "Lifestyle", "Entertainment", "Education"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Radio className="w-4 h-4" />
              Go Live
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Start Your <span className="text-primary">Stream</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Set up your stream details and start broadcasting to your audience
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Stream Setup */}
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <MonitorPlay className="w-5 h-5 text-primary" />
                Stream Details
              </h2>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Stream Title</Label>
                  <Input
                    id="title"
                    placeholder="Give your stream a catchy title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell viewers what your stream is about..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        variant={category === cat ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategory(cat)}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Stream Quality - Feature Gated */}
            <Card className="p-6 bg-card border-border lg:col-span-2">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Tv className="w-5 h-5 text-primary" />
                Stream Quality
              </h2>

              <div className="grid sm:grid-cols-3 gap-4">
                {/* 720p - Always available */}
                <button
                  onClick={() => setStreamQuality("720p")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    streamQuality === "720p" 
                      ? "border-primary bg-primary/10" 
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-semibold text-foreground">720p HD</p>
                  <p className="text-sm text-muted-foreground">Standard quality</p>
                  <Badge variant="secondary" className="mt-2">Free</Badge>
                </button>

                {/* 1080p - Creator tier */}
                <button
                  onClick={() => hasAccess("hd_streaming") && setStreamQuality("1080p")}
                  className={`p-4 rounded-xl border-2 transition-all relative ${
                    streamQuality === "1080p" 
                      ? "border-primary bg-primary/10" 
                      : hasAccess("hd_streaming")
                        ? "border-border hover:border-primary/50"
                        : "border-border opacity-60 cursor-not-allowed"
                  }`}
                >
                  {!hasAccess("hd_streaming") && (
                    <Lock className="absolute top-2 right-2 w-4 h-4 text-muted-foreground" />
                  )}
                  <p className="font-semibold text-foreground">1080p Full HD</p>
                  <p className="text-sm text-muted-foreground">High quality</p>
                  <Badge className="mt-2 bg-gradient-to-r from-primary to-purple-500 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Creator
                  </Badge>
                </button>

                {/* 4K - Pro tier */}
                <button
                  onClick={() => hasAccess("4k_streaming") && setStreamQuality("4k")}
                  className={`p-4 rounded-xl border-2 transition-all relative ${
                    streamQuality === "4k" 
                      ? "border-amber-500 bg-amber-500/10" 
                      : hasAccess("4k_streaming")
                        ? "border-border hover:border-amber-500/50"
                        : "border-border opacity-60 cursor-not-allowed"
                  }`}
                >
                  {!hasAccess("4k_streaming") && (
                    <Lock className="absolute top-2 right-2 w-4 h-4 text-muted-foreground" />
                  )}
                  <p className="font-semibold text-foreground">4K Ultra HD</p>
                  <p className="text-sm text-muted-foreground">Maximum quality</p>
                  <Badge className="mt-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                </button>
              </div>

              {!hasAccess("hd_streaming") && (
                <FeatureGate feature="hd_streaming" showUpgradePrompt>
                  <></>
                </FeatureGate>
              )}
            </Card>

            {/* Custom Overlays - Pro Feature */}
            <Card className="p-6 bg-card border-border lg:col-span-2">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Custom Overlays
                {!hasAccess("custom_overlays") && (
                  <Badge className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </h2>

              <FeatureLockedOverlay feature="custom_overlays">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Enable Custom Overlay</p>
                      <p className="text-sm text-muted-foreground">Add your own branding to streams</p>
                    </div>
                    <Switch 
                      checked={enableOverlay} 
                      onCheckedChange={setEnableOverlay}
                    />
                  </div>
                  {enableOverlay && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <Button variant="outline" className="h-20">
                        Upload Logo
                      </Button>
                      <Button variant="outline" className="h-20">
                        Upload Frame
                      </Button>
                    </div>
                  )}
                </div>
              </FeatureLockedOverlay>
            </Card>

            {/* Stream Key */}
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                Stream Settings
              </h2>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Server URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={rtmpUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => copyToClipboard(rtmpUrl, "Server URL")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Stream Key</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showStreamKey ? "text" : "password"}
                        value={streamKey}
                        readOnly
                        className="font-mono text-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowStreamKey(!showStreamKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showStreamKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => copyToClipboard(streamKey, "Stream Key")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Never share your stream key with anyone
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-medium text-foreground mb-3">Quick Setup</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <Camera className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm text-foreground">OBS Studio</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <Mic className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm text-foreground">Streamlabs</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Start Stream Button */}
          <div className="mt-8 text-center">
            <Button variant="default" size="xl" className="glow gap-2">
              <Video className="w-5 h-5" />
              Start Streaming
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Make sure your streaming software is connected before going live
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GoLive;
