import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Video, Settings, Radio, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const GoLive = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Go Live
            </h1>
            <p className="text-lg text-muted-foreground">
              Start streaming to your audience in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>
                  Go live instantly with default settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/stream-setup">
                  <Button className="w-full gap-2">
                    <Radio className="h-4 w-4" />
                    Start Streaming
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle>Advanced Setup</CardTitle>
                <CardDescription>
                  Configure stream settings before going live
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/stream-setup">
                  <Button variant="outline" className="w-full gap-2">
                    <Settings className="h-4 w-4" />
                    Configure Stream
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Streaming Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Ensure stable internet connection (at least 5 Mbps upload)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Use good lighting for better video quality
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Test your audio before going live
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Engage with your chat to build community
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GoLive;
