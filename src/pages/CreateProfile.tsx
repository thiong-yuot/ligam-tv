import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Camera, Palette, Loader2 } from "lucide-react";

const CreateProfile = () => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, just show success and redirect
      toast({
        title: "Profile Created!",
        description: "Your streamer profile is ready. Start streaming now!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create profile",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <User className="w-4 h-4" />
              Create Profile
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Set Up Your <span className="text-primary">Streamer Profile</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Customize how viewers see you on Ligam.tv
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Placeholder */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center border-4 border-primary/20">
                    <User className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Camera className="w-5 h-5 text-primary-foreground" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a unique username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will be your unique identifier: ligam.tv/{username || "username"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell viewers about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {bio.length}/300 characters
                </p>
              </div>

              {/* Theme Selection */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Channel Theme
                </Label>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    "bg-primary",
                    "bg-blue-500",
                    "bg-purple-500",
                    "bg-pink-500",
                    "bg-orange-500",
                  ].map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`w-full aspect-square rounded-lg ${color} border-2 border-transparent hover:border-foreground/50 transition-colors ${
                        index === 0 ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full glow" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  "Create Profile"
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CreateProfile;
