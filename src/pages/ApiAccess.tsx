import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
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
  Key
} from "lucide-react";

const ApiAccess = () => {
  const [checking, setChecking] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
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
                { method: "POST", path: "/webhooks", description: "Register a webhook" },
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
