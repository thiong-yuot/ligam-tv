import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Settings, 
  Wifi, 
  Monitor, 
  Mic, 
  Key, 
  Play, 
  CheckCircle,
  ArrowRight,
  Download,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import LigamLogo from "@/components/LigamLogo";

const StreamSetup = () => {
  const steps = [
    {
      step: 1,
      title: "Get Your Stream Key",
      icon: Key,
      description: "Navigate to your Dashboard and find your unique stream key. Keep this private - it's like a password for your stream.",
      instructions: [
        "Go to Dashboard → Go Live",
        "Click 'Create Stream' to generate your stream",
        "Copy your Stream Key (keep it secret!)",
        "Note your RTMP URL for the streaming software"
      ]
    },
    {
      step: 2,
      title: "Download Streaming Software",
      icon: Download,
      description: "You'll need broadcasting software to stream. We recommend OBS Studio (free) or Streamlabs for beginners.",
      instructions: [
        "Download OBS Studio from obsproject.com",
        "Install the software on your computer",
        "Open OBS and complete the initial setup wizard",
        "Choose 'Optimize for streaming' when prompted"
      ],
      links: [
        { name: "OBS Studio", url: "https://obsproject.com" },
        { name: "Streamlabs", url: "https://streamlabs.com" }
      ]
    },
    {
      step: 3,
      title: "Configure Your Stream Settings",
      icon: Settings,
      description: "Set up OBS with your Ligam.tv stream key and optimize your settings for the best quality.",
      instructions: [
        "In OBS, go to Settings → Stream",
        "Select 'Custom' as the Service",
        "Paste your RTMP URL in the Server field",
        "Paste your Stream Key in the Stream Key field",
        "Go to Settings → Output and set bitrate to 4500-6000 kbps",
        "Set encoder to x264 or NVENC (if you have NVIDIA GPU)"
      ]
    },
    {
      step: 4,
      title: "Set Up Your Scene",
      icon: Monitor,
      description: "Create your streaming layout with your camera, game capture, and any overlays you want.",
      instructions: [
        "In OBS, right-click in Sources and add 'Video Capture Device' for your camera",
        "Add 'Display Capture' or 'Game Capture' for your content",
        "Arrange sources by dragging them in the preview",
        "Add 'Image' sources for overlays and branding"
      ]
    },
    {
      step: 5,
      title: "Configure Audio",
      icon: Mic,
      description: "Make sure your microphone and desktop audio are properly configured for clear sound.",
      instructions: [
        "Go to Settings → Audio",
        "Select your microphone under 'Mic/Auxiliary Audio'",
        "Select your speakers/headphones under 'Desktop Audio'",
        "Test levels in the Audio Mixer panel",
        "Add noise suppression filter to your mic if needed"
      ]
    },
    {
      step: 6,
      title: "Test Your Connection",
      icon: Wifi,
      description: "Before going live, test your internet connection and do a practice run.",
      instructions: [
        "Run a speed test - you need at least 10 Mbps upload",
        "Use a wired ethernet connection if possible",
        "Click 'Start Recording' in OBS to test locally first",
        "Review your recording for quality issues"
      ]
    },
    {
      step: 7,
      title: "Go Live!",
      icon: Play,
      description: "You're ready to start streaming! Click the button and share your content with the world.",
      instructions: [
        "Make sure your stream is set to 'Live' in your Ligam dashboard",
        "Click 'Start Streaming' in OBS",
        "Wait for confirmation that you're connected",
        "Check your Ligam channel to verify the stream is working",
        "Engage with your viewers in chat!"
      ]
    }
  ];

  const requirements = [
    { label: "Internet", value: "10+ Mbps upload speed (20+ recommended)" },
    { label: "CPU", value: "Intel i5/AMD Ryzen 5 or better" },
    { label: "RAM", value: "8GB minimum, 16GB recommended" },
    { label: "GPU", value: "Dedicated GPU recommended for encoding" },
    { label: "Camera", value: "720p webcam minimum (1080p recommended)" },
    { label: "Microphone", value: "USB microphone or headset with mic" }
  ];

  return (
    <Layout showNavbar={false} showSidebar={false}>
      {/* Back to Home Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <LigamLogo className="h-8 w-8" />
            <span className="text-lg font-display font-bold text-foreground">
              Ligam<span className="text-primary">.tv</span>
            </span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-muted text-foreground border-border mb-4">
              <Video className="w-3 h-3 mr-1" />
              Streaming Guide
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              How to Set Up Your <span className="text-primary">Live Stream</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Follow this step-by-step guide to start streaming on Ligam.tv. From getting your stream key to going live, we'll walk you through everything.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/go-live">
                <Button>
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-12 border-y border-border bg-card/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">System Requirements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {requirements.map((req) => (
              <Card key={req.label} className="bg-secondary/50 border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-semibold text-primary mb-1">{req.label}</p>
                  <p className="text-xs text-muted-foreground">{req.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {steps.map((step, index) => (
              <Card 
                key={step.step} 
                className="bg-card border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-muted flex items-center justify-center border border-border">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                          Step {step.step}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                      <p className="text-muted-foreground mt-2">{step.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="ml-16 space-y-4">
                    <ul className="space-y-2">
                      {step.instructions.map((instruction, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{instruction}</span>
                        </li>
                      ))}
                    </ul>
                    {step.links && (
                      <div className="flex gap-3 pt-2">
                        {step.links.map((link) => (
                          <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                          >
                            {link.name}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Pro Tips for Better Streams</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Stream at consistent times to build an audience",
                "Interact with chat regularly to keep viewers engaged",
                "Use good lighting for your camera",
                "Have a backup plan if something goes wrong",
                "Create a pre-stream checklist",
                "Test everything before going live"
              ].map((tip, i) => (
                <Card key={i} className="bg-card/50 border-border/50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-card border-border">
            <CardContent className="p-8 lg:p-12 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Ready to Start Streaming?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Head to your dashboard to get your stream key and start broadcasting today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/go-live">
                  <Button size="lg">
                    <Video className="w-4 h-4 mr-2" />
                    Start Streaming
                  </Button>
                </Link>
                <Link to="/help">
                  <Button size="lg" variant="outline">
                    Need More Help?
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default StreamSetup;
