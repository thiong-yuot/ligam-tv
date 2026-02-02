import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Video, Copy, Eye, EyeOff } from "lucide-react";

const StreamSetup = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showKey, setShowKey] = useState(false);
  const [streamSettings, setStreamSettings] = useState({
    title: "",
    description: "",
    category: "",
    isPaid: false,
    price: 0,
  });

  // Mock stream key - in production this would come from Mux or similar
  const streamKey = "live_xxxxxxxxxxxxxxxxxxxx";
  const rtmpUrl = "rtmp://live.ligam.tv/live";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const handleStartStream = () => {
    if (!streamSettings.title) {
      toast({
        title: "Error",
        description: "Please enter a stream title",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Stream Created",
      description: "You can now start streaming with your broadcasting software",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground">
              Stream Setup
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure your stream settings
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Stream Details
                </CardTitle>
                <CardDescription>
                  Set up your stream title and description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Stream Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter your stream title"
                    value={streamSettings.title}
                    onChange={(e) => setStreamSettings(s => ({ ...s, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What will you be streaming?"
                    value={streamSettings.description}
                    onChange={(e) => setStreamSettings(s => ({ ...s, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Gaming, Music, Art"
                    value={streamSettings.category}
                    onChange={(e) => setStreamSettings(s => ({ ...s, category: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monetization</CardTitle>
                <CardDescription>
                  Set up paid access for your stream
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Paid Stream</Label>
                    <p className="text-sm text-muted-foreground">
                      Require payment to watch
                    </p>
                  </div>
                  <Switch
                    checked={streamSettings.isPaid}
                    onCheckedChange={(checked) => setStreamSettings(s => ({ ...s, isPaid: checked }))}
                  />
                </div>
                {streamSettings.isPaid && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={streamSettings.price}
                      onChange={(e) => setStreamSettings(s => ({ ...s, price: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stream Credentials</CardTitle>
                <CardDescription>
                  Use these in your broadcasting software (OBS, Streamlabs, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>RTMP URL</Label>
                  <div className="flex gap-2">
                    <Input value={rtmpUrl} readOnly />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(rtmpUrl, "RTMP URL")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Stream Key</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showKey ? "text" : "password"}
                        value={streamKey}
                        readOnly
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => setShowKey(!showKey)}
                      >
                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(streamKey, "Stream Key")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Keep your stream key private. Anyone with this key can stream to your channel.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button size="lg" className="w-full" onClick={handleStartStream}>
              Save & Get Ready to Stream
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StreamSetup;
