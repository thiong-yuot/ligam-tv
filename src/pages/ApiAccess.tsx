import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Code, 
  Copy, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Loader2,
  Crown,
  Lock,
  BookOpen,
  Terminal,
  Zap,
  Shield,
  Key,
  Webhook,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Radio,
  Clock,
  Activity,
  AlertTriangle,
  RotateCcw
} from "lucide-react";

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  secret: string;
  createdAt: string;
}

interface WebhookDelivery {
  id: string;
  webhookId: string;
  webhookUrl: string;
  event: string;
  statusCode: number;
  timestamp: string;
  duration: number;
  success: boolean;
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: string;
  isRetrying?: boolean;
}

const WEBHOOK_EVENTS = [
  { id: "stream.started", label: "Stream Started", description: "When a stream goes live" },
  { id: "stream.ended", label: "Stream Ended", description: "When a stream ends" },
  { id: "stream.viewer_milestone", label: "Viewer Milestone", description: "When viewer count hits milestones" },
  { id: "gift.received", label: "Gift Received", description: "When a virtual gift is received" },
  { id: "subscription.created", label: "New Subscription", description: "When someone subscribes" },
  { id: "subscription.cancelled", label: "Subscription Cancelled", description: "When a subscription is cancelled" },
  { id: "follower.new", label: "New Follower", description: "When someone follows you" },
  { id: "chat.message", label: "Chat Message", description: "When a chat message is sent" },
];

const ApiAccess = () => {
  const [checking, setChecking] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [isAddingWebhook, setIsAddingWebhook] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([]);
  const [editingWebhook, setEditingWebhook] = useState<WebhookEndpoint | null>(null);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasAccess, isLoading: featureLoading } = useFeatureAccess();

  const apiEndpoint = "https://api.ligam.tv/v1";

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

  const getBackoffDelay = (retryCount: number): number => {
    const baseDelay = 1000;
    const maxDelay = 5 * 60 * 1000;
    return Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
  };

  const formatBackoffTime = (ms: number): string => {
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60000)}m`;
  };

  const handleRetryDelivery = async (deliveryId: string) => {
    setDeliveries(prev => 
      prev.map(d => d.id === deliveryId ? { ...d, isRetrying: true } : d)
    );

    await new Promise(resolve => setTimeout(resolve, 1500));

    const isSuccess = Math.random() > 0.3;

    setDeliveries(prev =>
      prev.map(d => {
        if (d.id !== deliveryId) return d;
        
        if (isSuccess) {
          return {
            ...d,
            success: true,
            statusCode: 200,
            duration: Math.floor(Math.random() * 300) + 100,
            timestamp: new Date().toISOString(),
            isRetrying: false,
            nextRetryAt: undefined,
          };
        } else {
          const newRetryCount = d.retryCount + 1;
          const nextDelay = getBackoffDelay(newRetryCount);
          return {
            ...d,
            retryCount: newRetryCount,
            timestamp: new Date().toISOString(),
            isRetrying: false,
            nextRetryAt: newRetryCount < d.maxRetries 
              ? new Date(Date.now() + nextDelay).toISOString() 
              : undefined,
          };
        }
      })
    );

    const delivery = deliveries.find(d => d.id === deliveryId);
    if (isSuccess) {
      toast({
        title: "Retry Successful",
        description: "Webhook delivered successfully",
      });
    } else {
      const newRetryCount = (delivery?.retryCount || 0) + 1;
      const maxRetries = delivery?.maxRetries || 5;
      toast({
        title: "Retry Failed",
        description: newRetryCount >= maxRetries 
          ? "Maximum retries reached" 
          : `Will retry again in ${formatBackoffTime(getBackoffDelay(newRetryCount))}`,
        variant: "destructive",
      });
    }
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const regenerateKey = async () => {
    setIsRegenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newKey = `ligam_sk_live_${crypto.randomUUID().replace(/-/g, '')}`;
    setApiKey(newKey);
    setIsRegenerating(false);
    toast({
      title: "API Key Regenerated",
      description: "Your new API key is ready. Don't forget to update your applications.",
    });
  };

  const handleAddWebhook = () => {
    if (!newWebhookUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }
    if (newWebhookEvents.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one event",
        variant: "destructive",
      });
      return;
    }

    const newWebhook: WebhookEndpoint = {
      id: Date.now().toString(),
      url: newWebhookUrl,
      events: newWebhookEvents,
      active: true,
      secret: `whsec_${Math.random().toString(36).substring(2, 26)}`,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setWebhooks([...webhooks, newWebhook]);
    setNewWebhookUrl("");
    setNewWebhookEvents([]);
    setIsAddingWebhook(false);
    toast({
      title: "Webhook Created",
      description: "Your webhook endpoint has been registered",
    });
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter((w) => w.id !== id));
    toast({
      title: "Webhook Deleted",
      description: "The webhook endpoint has been removed",
    });
  };

  const handleToggleWebhook = (id: string) => {
    setWebhooks(
      webhooks.map((w) =>
        w.id === id ? { ...w, active: !w.active } : w
      )
    );
  };

  const toggleEventSelection = (eventId: string) => {
    setNewWebhookEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((e) => e !== eventId)
        : [...prev, eventId]
    );
  };

  if (checking || featureLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAccess("api_access")) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-28 pb-12 px-4">
          <div className="container mx-auto max-w-2xl">
            <Card className="p-8 text-center border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-orange-500/10">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-amber-500" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-4">
                API Access Requires Pro
              </h1>
              <p className="text-muted-foreground mb-6">
                The Ligam API is available exclusively for Pro subscribers. Upgrade your plan to unlock 
                programmatic access to streams, analytics, and more.
              </p>
              <div className="space-y-4">
                <div className="flex flex-col gap-2 text-left bg-background/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground">What you get with API access:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      Full REST API access
                    </li>
                    <li className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-amber-500" />
                      Webhooks for real-time events
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-500" />
                      Secure authentication
                    </li>
                    <li className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-500" />
                      Comprehensive documentation
                    </li>
                  </ul>
                </div>
                <Link to="/pricing">
                  <Button size="lg" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const displayKey = apiKey || "No API key generated yet";

  const codeExamples = {
    curl: `curl -X GET "${apiEndpoint}/streams" \\
  -H "Authorization: Bearer ${showApiKey && apiKey ? apiKey : "YOUR_API_KEY"}" \\
  -H "Content-Type: application/json"`,
    javascript: `const response = await fetch("${apiEndpoint}/streams", {
  method: "GET",
  headers: {
    "Authorization": "Bearer ${showApiKey && apiKey ? apiKey : "YOUR_API_KEY"}",
    "Content-Type": "application/json"
  }
});

const data = await response.json();
console.log(data);`,
    python: `import requests

headers = {
    "Authorization": "Bearer ${showApiKey && apiKey ? apiKey : "YOUR_API_KEY"}",
    "Content-Type": "application/json"
}

response = requests.get("${apiEndpoint}/streams", headers=headers)
data = response.json()
print(data)`,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              <Crown className="w-3 h-3 mr-1" />
              Pro Feature
            </Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              API <span className="text-primary">Access</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Integrate Ligam into your applications with our powerful REST API
            </p>
          </div>

          {/* API Key Section */}
          <Card className="p-6 bg-card border-border mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Your API Key</h2>
                <p className="text-sm text-muted-foreground">Use this key to authenticate API requests</p>
              </div>
            </div>

            <div className="space-y-4">
              {!apiKey ? (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No API key generated yet</p>
                  <Button onClick={regenerateKey} disabled={isRegenerating}>
                    {isRegenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Key className="w-4 h-4 mr-2" />
                    )}
                    Generate API Key
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        readOnly
                        className="font-mono text-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(apiKey, "API Key")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Keep your API key secure and never share it publicly
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <RefreshCw className="w-4 h-4" />
                          Regenerate
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Regenerate API Key?</DialogTitle>
                          <DialogDescription>
                            This will invalidate your current API key. Any applications using the old key will stop working.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button variant="destructive" onClick={regenerateKey} disabled={isRegenerating}>
                            {isRegenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                            Regenerate Key
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Webhooks Section */}
          <Card className="p-6 bg-card border-border mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Webhook className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Webhooks</h2>
                  <p className="text-sm text-muted-foreground">Receive real-time event notifications</p>
                </div>
              </div>
              <Button onClick={() => setIsAddingWebhook(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Webhook
              </Button>
            </div>

            {webhooks.length === 0 ? (
              <div className="text-center py-12">
                <Webhook className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No webhooks configured</p>
                <p className="text-sm text-muted-foreground">Add a webhook to receive real-time event notifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="p-4 rounded-lg border border-border bg-secondary/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${webhook.active ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                        <span className="font-mono text-sm text-foreground truncate max-w-md">{webhook.url}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={webhook.active} onCheckedChange={() => handleToggleWebhook(webhook.id)} />
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteWebhook(webhook.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="secondary" className="text-xs">{event}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Webhook Dialog */}
            <Dialog open={isAddingWebhook} onOpenChange={setIsAddingWebhook}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Webhook Endpoint</DialogTitle>
                  <DialogDescription>
                    Configure a new webhook to receive event notifications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Endpoint URL</Label>
                    <Input
                      id="webhookUrl"
                      placeholder="https://your-app.com/webhooks/ligam"
                      value={newWebhookUrl}
                      onChange={(e) => setNewWebhookUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Events to Subscribe</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {WEBHOOK_EVENTS.map((event) => (
                        <label key={event.id} className="flex items-center gap-2 p-2 rounded border border-border hover:bg-secondary/50 cursor-pointer">
                          <Checkbox
                            checked={newWebhookEvents.includes(event.id)}
                            onCheckedChange={() => toggleEventSelection(event.id)}
                          />
                          <span className="text-sm">{event.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingWebhook(false)}>Cancel</Button>
                  <Button onClick={handleAddWebhook}>Add Webhook</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>

          {/* Webhook Deliveries */}
          {deliveries.length > 0 && (
            <Card className="p-6 bg-card border-border mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Recent Deliveries</h2>
                  <p className="text-sm text-muted-foreground">Webhook delivery history</p>
                </div>
              </div>
              <div className="space-y-3">
                {deliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      {delivery.success ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                      <div>
                        <span className="text-sm font-medium">{delivery.event}</span>
                        <p className="text-xs text-muted-foreground">{getTimeAgo(delivery.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={delivery.success ? "secondary" : "destructive"}>{delivery.statusCode}</Badge>
                      {!delivery.success && delivery.retryCount < delivery.maxRetries && (
                        <Button variant="ghost" size="sm" onClick={() => handleRetryDelivery(delivery.id)} disabled={delivery.isRetrying}>
                          {delivery.isRetrying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Code Examples */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Quick Start</h2>
                <p className="text-sm text-muted-foreground">Get started with our API</p>
              </div>
            </div>

            <Tabs defaultValue="curl">
              <TabsList className="mb-4">
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              {Object.entries(codeExamples).map(([lang, code]) => (
                <TabsContent key={lang} value={lang}>
                  <div className="relative">
                    <pre className="p-4 rounded-lg bg-secondary/50 overflow-x-auto text-sm font-mono">
                      <code>{code}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(code, "Code")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ApiAccess;