import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Camera, Palette, Loader2, Check, Globe, ArrowRight, ArrowLeft, Edit, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const CreateProfile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [step, setStep] = useState(1);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const hasProfile = !!(profile?.username && profile?.display_name);

  const themes = [
    { color: "bg-primary", name: "Default" },
    { color: "bg-blue-500", name: "Ocean" },
    { color: "bg-cyan-500", name: "Sky" },
    { color: "bg-pink-500", name: "Rose" },
    { color: "bg-orange-500", name: "Sunset" },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      if (profile) {
        setUsername(profile.username || "");
        setDisplayName(profile.display_name || "");
        setBio(profile.bio || "");
        if (profile.website) setWebsite(profile.website);
      }
      setChecking(false);
    };
    checkAuth();
  }, [navigate, profile]);

  const handleStartEdit = () => {
    if (profile) {
      setUsername(profile.username || "");
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
      setWebsite(profile.website || "");
    }
    setEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasProfile && step < 3) { setStep(step + 1); return; }

    setLoading(true);
    try {
      if (!user) throw new Error("Not authenticated");
      const profileData = {
        user_id: user.id,
        username: username.toLowerCase().replace(/\s/g, ""),
        display_name: displayName,
        bio,
        website,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("profiles").upsert(profileData, { onConflict: "user_id" });
      if (error) throw error;
      await supabase.from("freelancers").update({ name: displayName }).eq("user_id", user.id);
      await refreshProfile();
      toast({ title: hasProfile ? "Profile Updated!" : "Profile Created!", description: hasProfile ? "Your changes have been saved." : "Your profile is ready." });
      if (hasProfile) { setEditing(false); } else { navigate("/dashboard"); }
    } catch (error: unknown) {
      toast({ variant: "destructive", title: "Error", description: error instanceof Error ? error.message : "Failed to save profile" });
    } finally { setLoading(false); }
  };

  if (checking) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  // ── View Mode (profile exists & not editing) ──
  if (hasProfile && !editing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-2xl">
            <div className="flex items-center gap-2 mb-8">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-lg font-semibold text-foreground">My Profile</h1>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border">
              {/* Avatar + name */}
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground">{profile?.display_name}</h2>
                  <p className="text-muted-foreground">@{profile?.username}</p>
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-4 mb-8">
                {profile?.bio && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Bio</p>
                    <p className="text-sm text-foreground">{profile.bio}</p>
                  </div>
                )}
                {profile?.website && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Website</p>
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{profile.website}</a>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">{profile?.follower_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">{profile?.following_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">{profile?.total_views || 0}</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                </div>
              </div>

              <Button onClick={handleStartEdit} className="w-full" size="lg">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // ── Edit Mode (profile exists & editing) ──
  if (hasProfile && editing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-2xl">
            <div className="flex items-center gap-2 mb-8">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(false)}>
                <X className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-semibold text-foreground">Edit Profile</h1>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-4 border-primary/20">
                    <User className="w-12 h-12 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input id="username" type="text" placeholder="Choose a unique username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))} required />
                  <p className="text-xs text-muted-foreground">ligam.tv/{username || "username"}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input id="displayName" type="text" placeholder="How should we call you?" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" placeholder="Tell viewers about yourself..." value={bio} onChange={(e) => setBio(e.target.value.slice(0, 300))} rows={4} />
                  <p className="text-xs text-muted-foreground">{bio.length}/300</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2"><Globe className="w-4 h-4" /> Website / Social Link</Label>
                  <Input id="website" type="url" placeholder="https://your-website.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setEditing(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1" disabled={loading || !username || !displayName}>
                    {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // ── Create Mode (no profile — step wizard) ──
  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /></Button>
            <h1 className="text-lg font-semibold text-foreground">Create Profile</h1>
          </div>
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Step {step} of 3</span>
              <span className="text-primary font-medium">{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <User className="w-4 h-4" />
              {step === 1 ? "Basic Info" : step === 2 ? "About You" : "Appearance"}
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {step === 1 && <>Welcome! Let's set up your <span className="text-primary">profile</span></>}
              {step === 2 && <>Tell us about <span className="text-primary">yourself</span></>}
              {step === 3 && <>Customize your <span className="text-primary">look</span></>}
            </h1>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center border-4 border-primary/20"><User className="w-16 h-16 text-muted-foreground" /></div>
                      <button type="button" className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"><Camera className="w-5 h-5 text-primary-foreground" /></button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input id="username" type="text" placeholder="Choose a unique username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))} required />
                    <p className="text-xs text-muted-foreground">ligam.tv/{username || "username"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name *</Label>
                    <Input id="displayName" type="text" placeholder="How should we call you?" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Tell viewers about yourself..." value={bio} onChange={(e) => setBio(e.target.value.slice(0, 300))} rows={5} />
                    <p className="text-xs text-muted-foreground">{bio.length}/300 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2"><Globe className="w-4 h-4" /> Website / Social Link</Label>
                    <Input id="website" type="url" placeholder="https://your-website.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2"><Palette className="w-4 h-4" /> Channel Theme</Label>
                    <div className="grid grid-cols-5 gap-4">
                      {themes.map((theme, index) => (
                        <button key={index} type="button" onClick={() => setSelectedTheme(index)} className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${selectedTheme === index ? "border-primary bg-primary/5" : "border-transparent hover:border-border"}`}>
                          <div className={`w-12 h-12 rounded-full ${theme.color} flex items-center justify-center`}>{selectedTheme === index && <Check className="w-6 h-6 text-white" />}</div>
                          <span className="text-xs text-muted-foreground">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 p-6 rounded-xl bg-background border border-border">
                    <p className="text-sm text-muted-foreground mb-4">Preview</p>
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full ${themes[selectedTheme].color} flex items-center justify-center`}><User className="w-8 h-8 text-white" /></div>
                      <div><h3 className="text-lg font-semibold">{displayName || "Your Name"}</h3><p className="text-muted-foreground">@{username || "username"}</p></div>
                    </div>
                    {bio && <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{bio}</p>}
                  </div>
                </>
              )}
              <div className="flex gap-4">
                {step > 1 && <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>Back</Button>}
                <Button type="submit" className={`glow ${step > 1 ? "flex-1" : "w-full"}`} size="lg" disabled={loading || (step === 1 && (!username || !displayName))}>
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : step < 3 ? <>Continue<ArrowRight className="w-4 h-4 ml-2" /></> : "Complete Setup"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CreateProfile;