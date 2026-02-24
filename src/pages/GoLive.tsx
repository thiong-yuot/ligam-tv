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
import { useUserStream, useCreateMuxStream, useStreamStatus, useStreamCredentials, useUpdateStream } from "@/hooks/useStreams";
import { useSubscription, SUBSCRIPTION_TIERS } from "@/hooks/useSubscription";
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
  Palette,
  Key,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  DollarSign,
  Upload,
  Play
} from "lucide-react";
import { Link } from "react-router-dom";

const GoLive = () => {
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Gaming");
  const [streamQuality, setStreamQuality] = useState<"720p" | "1080p" | "4k">("720p");
  const [enableOverlay, setEnableOverlay] = useState(false);
  const [isPaidStream, setIsPaidStream] = useState(false);
  const [accessPrice, setAccessPrice] = useState("");
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasAccess } = useFeatureAccess();
  const { tier } = useSubscription();

  const { data: userStream, isLoading: streamLoading, refetch: refetchStream } = useUserStream(userId || "");
  const { data: streamCredentials, isLoading: credentialsLoading } = useStreamCredentials(userStream?.id || "");
  const { data: streamStatus, isLoading: statusLoading } = useStreamStatus();
  const createMuxStream = useCreateMuxStream();

  // Mux RTMP URL
  const rtmpUrl = "rtmps://global-live.mux.com:443/app";

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      } else {
        setUserId(session.user.id);
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

  const handleCreateStream = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a stream title",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMuxStream.mutateAsync({
        title,
        description,
        tags: [category],
      });
      
      toast({
        title: "Stream created!",
        description: "Your stream key is ready. Connect your streaming software.",
      });
      
      refetchStream();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create stream",
        variant: "destructive",
      });
    }
  };

  if (checking || streamLoading) {
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

  const streamKey = streamCredentials?.stream_key || null;
  const hlsUrl = userStream?.hls_url || null;
  const isLive = userStream?.is_live || false;
  const muxStatus = streamStatus?.muxStatus?.status;

  const getStreamStatusBadge = () => {
    if (isLive) {
      return (
        <Badge className="bg-red-500 text-white animate-pulse">
          <Radio className="w-3 h-3 mr-1" />
          LIVE
        </Badge>
      );
    }
    if (muxStatus === "active") {
      return (
        <Badge className="bg-green-500 text-white">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Ready
        </Badge>
      );
    }
    if (streamKey) {
      return (
        <Badge variant="secondary">
          <AlertCircle className="w-3 h-3 mr-1" />
          Idle
        </Badge>
      );
    }
    return null;
  };

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
              {getStreamStatusBadge()}
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Start Your <span className="text-primary">Stream</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Low-latency streaming powered by Mux
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

                {/* Paid Streaming Section - Pro Only */}
                {true && (
                  <div className="space-y-4 p-4 rounded-xl border-2 border-primary/30 bg-primary/5">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground border-0">
                        Paid Live Streaming
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Enable Paid Access</p>
                        <p className="text-sm text-muted-foreground">Viewers pay to watch your stream</p>
                      </div>
                      <Switch 
                        checked={isPaidStream} 
                        onCheckedChange={setIsPaidStream}
                      />
                    </div>

                    {isPaidStream && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="accessPrice">Access Price (USD)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="accessPrice"
                              type="number"
                              min="1"
                              step="0.01"
                              placeholder="9.99"
                              value={accessPrice}
                              onChange={(e) => setAccessPrice(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Ligam takes 40% • You receive ${accessPrice ? (parseFloat(accessPrice) * 0.6).toFixed(2) : '0.00'}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>Preview Video (Optional)</Label>
                          <div className="flex items-center gap-4">
                            {previewVideoUrl && (
                              <video src={previewVideoUrl} className="h-20 w-32 object-cover rounded-lg" controls />
                            )}
                            <input
                              type="file"
                              accept="video/*"
                              capture="user"
                              className="hidden"
                              id="previewVideoInput"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file || !userId) return;
                                const fileExt = file.name.split(".").pop();
                                const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                                const { error } = await supabase.storage.from("post-media").upload(fileName, file);
                                if (!error) {
                                  const { data } = supabase.storage.from("post-media").getPublicUrl(fileName);
                                  setPreviewVideoUrl(data.publicUrl);
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("previewVideoInput")?.click()}
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              {previewVideoUrl ? "Re-record" : "Record Preview"}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Record a free preview video explaining what viewers will see in your paid stream
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}


                {!streamKey && (
                  <Button 
                    onClick={handleCreateStream} 
                    className="w-full glow"
                    disabled={createMuxStream.isPending}
                  >
                    {createMuxStream.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Stream...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        Generate Stream Key
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>

            {/* Stream Key */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-primary" />
                  Stream Settings
                </h2>
                {streamKey && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => refetchStream()}
                    disabled={statusLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${statusLoading ? "animate-spin" : ""}`} />
                  </Button>
                )}
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Server URL (RTMPS)</Label>
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
                  <p className="text-xs text-muted-foreground">
                    Use RTMPS for secure streaming to Mux
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Stream Key</Label>
                  {credentialsLoading ? (
                    <div className="text-center py-6 bg-secondary/30 rounded-lg">
                      <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-spin" />
                      <p className="text-sm text-muted-foreground">Loading credentials...</p>
                    </div>
                  ) : streamKey ? (
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
                  ) : (
                    <div className="text-center py-6 bg-secondary/30 rounded-lg">
                      <Key className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No stream key available</p>
                      <p className="text-xs text-muted-foreground">Fill in your details and generate a key</p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Never share your stream key with anyone
                  </p>
                </div>

                {hlsUrl && (
                  <div className="space-y-2">
                    <Label>Playback URL (HLS)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={hlsUrl}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyToClipboard(hlsUrl, "HLS URL")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

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
                  <Badge className="mt-2 bg-gradient-to-r from-primary to-blue-500 text-white border-0">
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
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg border border-dashed border-border text-center cursor-pointer hover:border-primary/50 transition-colors">
                        <Video className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload overlay image</p>
                        <p className="text-xs text-muted-foreground">PNG with transparency recommended</p>
                      </div>
                    </div>
                  )}
                </div>
              </FeatureLockedOverlay>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GoLive;
