import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUserStream, useCreateMuxStream, useStreamCredentials } from "@/hooks/useStreams";
import {
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Radio,
  Camera,
  Key,
  DollarSign,
} from "lucide-react";

const GoLive = () => {
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Gaming");
  const [isPaidStream, setIsPaidStream] = useState(false);
  const [accessPrice, setAccessPrice] = useState("");
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: userStream, isLoading: streamLoading, refetch: refetchStream } = useUserStream(userId || "");
  const { data: streamCredentials, isLoading: credentialsLoading } = useStreamCredentials(userStream?.id || "");
  const createMuxStream = useCreateMuxStream();

  const rtmpUrl = "rtmps://global-live.mux.com:443/app";

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
      }
      setChecking(false);
    };
    checkAuth();
  }, [navigate]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard` });
  };

  const handleCreateStream = async () => {
    if (!title.trim()) {
      toast({ title: "Title required", description: "Please enter a stream title", variant: "destructive" });
      return;
    }
    try {
      await createMuxStream.mutateAsync({ title, description, tags: [category] });
      toast({ title: "Stream created!", description: "Your stream key is ready." });
      refetchStream();
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to create stream", variant: "destructive" });
    }
  };

  if (checking || streamLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const categories = ["Gaming", "Music", "Creative", "Talk Shows", "Coding", "Fitness", "Education"];
  const streamKey = streamCredentials?.stream_key || null;
  const isLive = userStream?.is_live || false;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-2xl space-y-6">

          {/* Header */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-foreground">Go Live</h1>
            {isLive && (
              <Badge variant="destructive" className="animate-pulse">
                <Radio className="w-3 h-3 mr-1" />
                LIVE
              </Badge>
            )}
          </div>

          {/* Stream Details */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Stream title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="What's your stream about?" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <Button key={cat} variant={category === cat ? "default" : "outline"} size="sm" className="h-7 text-xs" onClick={() => setCategory(cat)}>
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Paid Access */}
          <div className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Paid Access</p>
                <p className="text-xs text-muted-foreground">Charge viewers to watch</p>
              </div>
              <Switch checked={isPaidStream} onCheckedChange={setIsPaidStream} />
            </div>

            {isPaidStream && (
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="space-y-1.5">
                  <Label htmlFor="accessPrice">Price (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="accessPrice" type="number" min="1" step="0.01" placeholder="9.99" value={accessPrice} onChange={(e) => setAccessPrice(e.target.value)} className="pl-9" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    40% platform fee · You receive ${accessPrice ? (parseFloat(accessPrice) * 0.6).toFixed(2) : "0.00"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label>Preview Video</Label>
                  <div className="flex items-center gap-3">
                    {previewVideoUrl && <video src={previewVideoUrl} className="h-16 w-24 object-cover rounded" controls />}
                    <input type="file" accept="video/*" capture="user" className="hidden" id="previewVideoInput" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file || !userId) return;
                      const fileExt = file.name.split(".").pop();
                      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                      const { error } = await supabase.storage.from("post-media").upload(fileName, file);
                      if (!error) {
                        const { data } = supabase.storage.from("post-media").getPublicUrl(fileName);
                        setPreviewVideoUrl(data.publicUrl);
                      }
                    }} />
                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("previewVideoInput")?.click()}>
                      <Camera className="h-3.5 w-3.5 mr-1.5" />
                      {previewVideoUrl ? "Re-record" : "Record"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generate / Credentials */}
          {!streamKey ? (
            <Button onClick={handleCreateStream} className="w-full" disabled={createMuxStream.isPending}>
              {createMuxStream.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
              {createMuxStream.isPending ? "Creating..." : "Generate Stream Key"}
            </Button>
          ) : (
            <div className="rounded-lg border border-border p-4 space-y-4">
              <p className="text-sm font-medium text-foreground">Connection Details</p>

              <div className="space-y-1.5">
                <Label className="text-xs">Server URL</Label>
                <div className="flex gap-2">
                  <Input value={rtmpUrl} readOnly className="font-mono text-xs h-8" />
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard(rtmpUrl, "Server URL")}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Stream Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input type={showStreamKey ? "text" : "password"} value={streamKey} readOnly className="font-mono text-xs h-8 pr-8" />
                    <button type="button" onClick={() => setShowStreamKey(!showStreamKey)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showStreamKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard(streamKey, "Stream Key")}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Use OBS Studio or Streamlabs to connect</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoLive;
