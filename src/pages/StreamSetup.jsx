import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useUserStream, useStreamCredentials, useCreateStream } from "@/hooks/useStreams";
import { Copy, Video, Settings, Key, ExternalLink, CheckCircle } from "lucide-react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const StreamSetup = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: userStream } = useUserStream(user?.id);
  const { data: streamCredentials } = useStreamCredentials(userStream?.id);
  const createStream = useCreateStream();
  const [streamSettings, setStreamSettings] = useState({
    title: "",
    description: "",
    is_paid: false,
    access_price: 0,
  });
  const [copied, setCopied] = useState({ key: false, url: false });

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  const handleCreateStream = async () => {
    if (!streamSettings.title) {
      toast.error("Please enter a stream title");
      return;
    }
    try {
      await createStream.mutateAsync(streamSettings);
      toast.success("Stream created! You can now start broadcasting.");
    } catch (error) {
      toast.error("Failed to create stream");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Stream Setup</h1>
          <p className="text-muted-foreground mt-1">Configure your stream settings and get your credentials</p>
        </div>

        <Tabs defaultValue="settings">
          <TabsList className="mb-6">
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Stream Settings
            </TabsTrigger>
            <TabsTrigger value="credentials">
              <Key className="h-4 w-4 mr-2" />
              Stream Credentials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Stream Configuration</CardTitle>
                <CardDescription>Set up your stream details before going live</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Stream Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter your stream title..."
                    value={streamSettings.title}
                    onChange={(e) => setStreamSettings({ ...streamSettings, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell viewers what your stream is about..."
                    value={streamSettings.description}
                    onChange={(e) => setStreamSettings({ ...streamSettings, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Paid Stream</Label>
                    <p className="text-sm text-muted-foreground">
                      Require viewers to pay for access
                    </p>
                  </div>
                  <Switch
                    checked={streamSettings.is_paid}
                    onCheckedChange={(checked) =>
                      setStreamSettings({ ...streamSettings, is_paid: checked })
                    }
                  />
                </div>

                {streamSettings.is_paid && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Access Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="9.99"
                      value={streamSettings.access_price}
                      onChange={(e) =>
                        setStreamSettings({
                          ...streamSettings,
                          access_price: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                )}

                <Button onClick={handleCreateStream} disabled={isLoading} className="w-full">
                  <Video className="h-4 w-4 mr-2" />
                  Create Stream
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credentials">
            <Card>
              <CardHeader>
                <CardTitle>Stream Credentials</CardTitle>
                <CardDescription>
                  Use these credentials in your streaming software (OBS, Streamlabs, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {streamCredentials ? (
                  <>
                    <div className="space-y-2">
                      <Label>RTMP URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={streamCredentials.rtmp_url}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopy(streamCredentials.rtmp_url, "url")}
                        >
                          {copied.url ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Stream Key</Label>
                      <div className="flex gap-2">
                        <Input
                          value={streamCredentials.stream_key}
                          readOnly
                          type="password"
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopy(streamCredentials.stream_key, "key")}
                        >
                          {copied.key ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Keep your stream key private. Never share it publicly.
                      </p>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Quick Setup Guide</h4>
                      <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                        <li>Open your streaming software (OBS, Streamlabs, etc.)</li>
                        <li>Go to Settings → Stream</li>
                        <li>Select "Custom" as the service</li>
                        <li>Paste the RTMP URL in the Server field</li>
                        <li>Paste the Stream Key in the Stream Key field</li>
                        <li>Click "Start Streaming" when ready</li>
                      </ol>
                    </div>

                    <Button variant="outline" className="w-full" onClick={() => navigate("/go-live")}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Go to Stream Dashboard
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">
                      Create a stream first to get your credentials
                    </p>
                    <Button onClick={() => document.querySelector('[value="settings"]')?.click()}>
                      Go to Settings
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StreamSetup;
