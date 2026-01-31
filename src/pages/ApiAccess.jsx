import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Key, Copy, Eye, EyeOff, RefreshCw, Code, Book, CheckCircle } from "lucide-react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const ApiAccess = () => {
  const { user, loading: authLoading } = useAuth();
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock API key - in production this would come from the backend
  const apiKey = "lgm_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx";

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

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API key copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const codeExamples = {
    curl: `curl -X GET "https://api.ligam.tv/v1/streams" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`,
    javascript: `const response = await fetch('https://api.ligam.tv/v1/streams', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,
    python: `import requests

headers = {
    'Authorization': f'Bearer ${apiKey}',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.ligam.tv/v1/streams', headers=headers)
data = response.json()
print(data)`,
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">API Access</h1>
          <p className="text-muted-foreground mt-1">
            Integrate Ligam into your applications with our REST API
          </p>
        </div>

        <div className="grid gap-6">
          {/* API Key Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Your API Key
              </CardTitle>
              <CardDescription>
                Use this key to authenticate your API requests. Keep it secret!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    value={showApiKey ? apiKey : "•".repeat(40)}
                    readOnly
                    className="font-mono pr-20"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-10 top-0 h-full"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Regenerate API Key</p>
                  <p className="text-sm text-muted-foreground">
                    This will invalidate your current key
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Code Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Quick Start
              </CardTitle>
              <CardDescription>Get started with these code examples</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="curl">
                <TabsList className="mb-4">
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>

                {Object.entries(codeExamples).map(([lang, code]) => (
                  <TabsContent key={lang} value={lang}>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{code}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          navigator.clipboard.writeText(code);
                          toast.success("Code copied!");
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Available Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Available Endpoints
              </CardTitle>
              <CardDescription>Overview of our API endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { method: "GET", endpoint: "/v1/streams", description: "List all streams" },
                  { method: "GET", endpoint: "/v1/streams/:id", description: "Get stream details" },
                  { method: "POST", endpoint: "/v1/streams", description: "Create a new stream" },
                  { method: "GET", endpoint: "/v1/users/:id", description: "Get user profile" },
                  { method: "GET", endpoint: "/v1/categories", description: "List all categories" },
                ].map((endpoint, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 border rounded-lg"
                  >
                    <Badge
                      variant={endpoint.method === "GET" ? "secondary" : "default"}
                      className="font-mono"
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="flex-1 text-sm font-mono">{endpoint.endpoint}</code>
                    <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm">
                  <strong>Rate Limits:</strong> 100 requests per minute for standard accounts.
                  Contact us for higher limits.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ApiAccess;
