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

// Mock webhook delivery logs
const INITIAL_MOCK_DELIVERIES: WebhookDelivery[] = [
  {
    id: "del_1",
    webhookId: "1",
    webhookUrl: "https://myapp.com/webhooks/ligam",
    event: "stream.started",
    statusCode: 200,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    duration: 245,
    success: true,
    retryCount: 0,
    maxRetries: 5,
  },
  {
    id: "del_2",
    webhookId: "1",
    webhookUrl: "https://myapp.com/webhooks/ligam",
    event: "gift.received",
    statusCode: 200,
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    duration: 189,
    success: true,
    retryCount: 0,
    maxRetries: 5,
  },
  {
    id: "del_3",
    webhookId: "1",
    webhookUrl: "https://myapp.com/webhooks/ligam",
    event: "follower.new",
    statusCode: 500,
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    duration: 1502,
    success: false,
    retryCount: 2,
    maxRetries: 5,
    nextRetryAt: new Date(Date.now() + 4 * 60 * 1000).toISOString(),
  },
  {
    id: "del_4",
    webhookId: "1",
    webhookUrl: "https://myapp.com/webhooks/ligam",
    event: "stream.ended",
    statusCode: 200,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    duration: 312,
    success: true,
    retryCount: 0,
    maxRetries: 5,
  },
  {
    id: "del_5",
    webhookId: "1",
    webhookUrl: "https://myapp.com/webhooks/ligam",
    event: "subscription.created",
    statusCode: 408,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    duration: 30000,
    success: false,
    retryCount: 5,
    maxRetries: 5,
  },
  {
    id: "del_6",
    webhookId: "1",
    webhookUrl: "https://myapp.com/webhooks/ligam",
    event: "gift.received",
    statusCode: 200,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    duration: 156,
    success: true,
    retryCount: 1,
    maxRetries: 5,
  },
];

const ApiAccess = () => {
  const [checking, setChecking] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([
    {
      id: "1",
      url: "https://myapp.com/webhooks/ligam",
      events: ["stream.started", "stream.ended", "gift.received"],
      active: true,
      secret: "whsec_xxxxxxxxxxxxxxxxxxxxxxxx",
      createdAt: "2024-01-15",
    },
  ]);
  const [isAddingWebhook, setIsAddingWebhook] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([]);
  const [editingWebhook, setEditingWebhook] = useState<WebhookEndpoint | null>(null);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>(INITIAL_MOCK_DELIVERIES);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasAccess, isLoading: featureLoading } = useFeatureAccess();

  // Mock API key (in production, this would come from the backend)
  const apiKey = "ligam_sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
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

  // Calculate exponential backoff delay
  const getBackoffDelay = (retryCount: number): number => {
    // Base delay of 1 second, doubles with each retry, max 5 minutes
    const baseDelay = 1000;
    const maxDelay = 5 * 60 * 1000;
    return Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
  };

  const formatBackoffTime = (ms: number): string => {
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60000)}m`;
  };

  const handleRetryDelivery = async (deliveryId: string) => {
    // Mark as retrying
    setDeliveries(prev => 
      prev.map(d => d.id === deliveryId ? { ...d, isRetrying: true } : d)
    );

    // Simulate retry with exponential backoff
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate random success/failure (70% success rate)
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
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

  // Check if user has API access (Pro tier only)
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
                    Upgrade to Pro - $15.99/mo
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

  const codeExamples = {
    curl: `curl -X GET "${apiEndpoint}/streams" \\
  -H "Authorization: Bearer ${showApiKey ? apiKey : "ligam_sk_live_****"}" \\
  -H "Content-Type: application/json"`,
    javascript: `const response = await fetch("${apiEndpoint}/streams", {
  method: "GET",
  headers: {
    "Authorization": "Bearer ${showApiKey ? apiKey : "ligam_sk_live_****"}",
    "Content-Type": "application/json"
  }
});

const data = await response.json();
console.log(data);`,
    python: `import requests

headers = {
    "Authorization": "Bearer ${showApiKey ? apiKey : "ligam_sk_live_****"}",
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
                <Button 
                  variant="outline"
                  onClick={regenerateKey}
                  disabled={isRegenerating}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? "animate-spin" : ""}`} />
                  Regenerate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Keep your API key secure. Do not share it publicly or commit it to version control.
              </p>
            </div>
          </Card>

          {/* API Endpoint */}
          <Card className="p-6 bg-card border-border mb-8">
            <h3 className="font-semibold text-foreground mb-4">Base URL</h3>
            <div className="flex gap-2">
              <Input
                value={apiEndpoint}
                readOnly
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => copyToClipboard(apiEndpoint, "API Endpoint")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Code Examples */}
          <Card className="p-6 bg-card border-border mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Quick Start</h2>
                <p className="text-sm text-muted-foreground">Get started with these code examples</p>
              </div>
            </div>

            <Tabs defaultValue="curl" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              {Object.entries(codeExamples).map(([lang, code]) => (
                <TabsContent key={lang} value={lang}>
                  <div className="relative">
                    <pre className="bg-secondary/50 rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm font-mono text-foreground">{code}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(code, "Code example")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
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
              <Dialog open={isAddingWebhook} onOpenChange={setIsAddingWebhook}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Webhook
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add Webhook Endpoint</DialogTitle>
                    <DialogDescription>
                      Configure a URL to receive event notifications from Ligam.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Endpoint URL</Label>
                      <Input
                        id="webhook-url"
                        placeholder="https://your-app.com/webhooks/ligam"
                        value={newWebhookUrl}
                        onChange={(e) => setNewWebhookUrl(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Must be a valid HTTPS URL
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Label>Events to Listen</Label>
                      <div className="grid gap-2 max-h-[200px] overflow-y-auto">
                        {WEBHOOK_EVENTS.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/50"
                          >
                            <Checkbox
                              id={event.id}
                              checked={newWebhookEvents.includes(event.id)}
                              onCheckedChange={() => toggleEventSelection(event.id)}
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={event.id}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {event.label}
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingWebhook(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddWebhook}>Create Webhook</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {webhooks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Webhook className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No webhooks configured</p>
                <p className="text-sm">Add a webhook to receive real-time events</p>
              </div>
            ) : (
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className={`p-4 rounded-lg border ${
                      webhook.active ? "border-border bg-secondary/30" : "border-border/50 bg-secondary/10 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {webhook.active ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          )}
                          <code className="text-sm font-mono text-foreground truncate">
                            {webhook.url}
                          </code>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {webhook.events.map((eventId) => {
                            const event = WEBHOOK_EVENTS.find((e) => e.id === eventId);
                            return (
                              <Badge key={eventId} variant="secondary" className="text-xs">
                                {event?.label || eventId}
                              </Badge>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Created: {webhook.createdAt}</span>
                          <button
                            onClick={() => copyToClipboard(webhook.secret, "Webhook secret")}
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            <Key className="w-3 h-3" />
                            Copy Secret
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={webhook.active}
                          onCheckedChange={() => handleToggleWebhook(webhook.id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteWebhook(webhook.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 rounded-lg bg-secondary/30 border border-dashed border-border">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Webhook Security
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Verify webhook signatures to ensure requests are from Ligam. Include the secret in your verification logic.
              </p>
              <pre className="bg-background/50 rounded p-3 text-xs font-mono overflow-x-auto">
{`// Verify webhook signature
const signature = req.headers['x-ligam-signature'];
const expectedSig = crypto
  .createHmac('sha256', webhookSecret)
  .update(JSON.stringify(req.body))
  .digest('hex');

if (signature !== expectedSig) {
  throw new Error('Invalid signature');
}`}
              </pre>
            </div>
          </Card>

          {/* Webhook Delivery Log */}
          <Card className="p-6 bg-card border-border mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Delivery Log</h2>
                  <p className="text-sm text-muted-foreground">Recent webhook delivery attempts</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Refresh
              </Button>
            </div>

            {/* Retry Info Banner */}
            <div className="mb-4 p-3 rounded-lg bg-secondary/30 border border-border flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">Exponential Backoff Retries</p>
                <p className="text-muted-foreground">
                  Failed deliveries are automatically retried with exponential backoff: 1s → 2s → 4s → 8s → 16s (up to 5 min max). 
                  You can also manually retry at any time.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {deliveries.map((delivery) => {
                const eventLabel = WEBHOOK_EVENTS.find(e => e.id === delivery.event)?.label || delivery.event;
                const timeAgo = getTimeAgo(delivery.timestamp);
                const canRetry = !delivery.success && !delivery.isRetrying;
                const isMaxRetriesReached = delivery.retryCount >= delivery.maxRetries;
                
                return (
                  <div
                    key={delivery.id}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                      delivery.success 
                        ? "bg-green-500/5 hover:bg-green-500/10" 
                        : "bg-red-500/5 hover:bg-red-500/10"
                    }`}
                  >
                    {/* Status Icon */}
                    <div className={`flex-shrink-0 ${delivery.success ? "text-green-500" : "text-red-500"}`}>
                      {delivery.isRetrying ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : delivery.success ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>

                    {/* Event & URL */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant="secondary" className="text-xs">
                          {eventLabel}
                        </Badge>
                        <code className="text-xs text-muted-foreground truncate hidden sm:block">
                          {delivery.webhookUrl}
                        </code>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo}
                        </span>
                        <span>{delivery.duration}ms</span>
                        {!delivery.success && (
                          <span className="flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" />
                            {delivery.retryCount}/{delivery.maxRetries} retries
                          </span>
                        )}
                        {delivery.nextRetryAt && !delivery.success && !isMaxRetriesReached && (
                          <span className="text-amber-500">
                            Next: {formatBackoffTime(getBackoffDelay(delivery.retryCount))}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Code */}
                    <Badge 
                      variant="outline" 
                      className={`font-mono text-xs ${
                        delivery.statusCode >= 200 && delivery.statusCode < 300
                          ? "text-green-500 border-green-500/50"
                          : delivery.statusCode >= 400 && delivery.statusCode < 500
                            ? "text-amber-500 border-amber-500/50"
                            : "text-red-500 border-red-500/50"
                      }`}
                    >
                      {delivery.statusCode}
                    </Badge>

                    {/* Retry Button */}
                    {canRetry && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-1.5 ${isMaxRetriesReached ? "text-muted-foreground" : "text-primary hover:text-primary"}`}
                        onClick={() => handleRetryDelivery(delivery.id)}
                        disabled={isMaxRetriesReached}
                        title={isMaxRetriesReached ? "Maximum retries reached" : "Retry delivery"}
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline">Retry</span>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {deliveries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No delivery attempts yet</p>
                <p className="text-sm">Webhook deliveries will appear here</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Showing last {deliveries.length} deliveries</span>
              <button className="text-primary hover:underline">View all logs</button>
            </div>
          </Card>

          {/* API Endpoints Documentation */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">API Endpoints</h2>
                <p className="text-sm text-muted-foreground">Available endpoints and their usage</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { method: "GET", path: "/streams", description: "List all your streams" },
                { method: "GET", path: "/streams/:id", description: "Get stream details" },
                { method: "POST", path: "/streams", description: "Create a new stream" },
                { method: "PUT", path: "/streams/:id", description: "Update stream settings" },
                { method: "DELETE", path: "/streams/:id", description: "Delete a stream" },
                { method: "GET", path: "/analytics", description: "Get analytics data" },
                { method: "GET", path: "/viewers", description: "Get viewer statistics" },
                { method: "GET", path: "/webhooks", description: "List webhook endpoints" },
                { method: "POST", path: "/webhooks", description: "Register a webhook" },
                { method: "DELETE", path: "/webhooks/:id", description: "Delete a webhook" },
              ].map((endpoint, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <Badge 
                    variant="outline" 
                    className={`font-mono text-xs min-w-[60px] justify-center ${
                      endpoint.method === "GET" ? "text-green-500 border-green-500/50" :
                      endpoint.method === "POST" ? "text-blue-500 border-blue-500/50" :
                      endpoint.method === "PUT" ? "text-amber-500 border-amber-500/50" :
                      "text-red-500 border-red-500/50"
                    }`}
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="font-mono text-sm text-foreground flex-1">{endpoint.path}</code>
                  <span className="text-sm text-muted-foreground hidden sm:block">{endpoint.description}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <Button variant="outline" className="w-full gap-2">
                <BookOpen className="w-4 h-4" />
                View Full Documentation
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ApiAccess;
