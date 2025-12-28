import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddServiceDialog from "@/components/AddServiceDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Plus,
  Star,
  DollarSign,
  Clock,
  Edit,
  Trash2,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  useMyFreelancerProfile,
  useMyFreelancerServices,
  useUpdateFreelancerProfile,
  useDeleteService,
} from "@/hooks/useFreelancerProfile";
import { toast } from "sonner";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyFreelancerProfile();
  const { data: services = [], isLoading: servicesLoading } = useMyFreelancerServices();
  const updateProfile = useUpdateFreelancerProfile();
  const deleteService = useDeleteService();

  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    title: "",
    bio: "",
    hourly_rate: "",
    portfolio_url: "",
    skills: [] as string[],
  });
  const [skillInput, setSkillInput] = useState("");

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!profile) {
    navigate("/freelance");
    return null;
  }

  const startEditing = () => {
    setEditForm({
      name: profile.name,
      title: profile.title,
      bio: profile.bio || "",
      hourly_rate: profile.hourly_rate?.toString() || "",
      portfolio_url: profile.portfolio_url || "",
      skills: profile.skills || [],
    });
    setIsEditing(true);
  };

  const addSkill = () => {
    if (skillInput.trim() && !editForm.skills.includes(skillInput.trim())) {
      setEditForm({ ...editForm, skills: [...editForm.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setEditForm({ ...editForm, skills: editForm.skills.filter((s) => s !== skill) });
  };

  const saveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        name: editForm.name,
        title: editForm.title,
        bio: editForm.bio || null,
        hourly_rate: editForm.hourly_rate ? parseFloat(editForm.hourly_rate) : null,
        portfolio_url: editForm.portfolio_url || null,
        skills: editForm.skills.length > 0 ? editForm.skills : null,
      });
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const toggleAvailability = async () => {
    try {
      await updateProfile.mutateAsync({ is_available: !profile.is_available });
      toast.success(profile.is_available ? "You're now unavailable" : "You're now available!");
    } catch (error: any) {
      toast.error("Failed to update availability");
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteService.mutateAsync(id);
      toast.success("Service deleted");
    } catch (error: any) {
      toast.error("Failed to delete service");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Freelancer Dashboard
              </h1>
              <p className="text-muted-foreground">Manage your profile and services</p>
            </div>
            <Button onClick={() => navigate("/freelance")} variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Marketplace
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {profile.name}
                      {profile.is_verified && (
                        <Badge variant="default" className="text-xs">Verified</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{profile.title}</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Available</span>
                      <Switch
                        checked={profile.is_available || false}
                        onCheckedChange={toggleAvailability}
                      />
                    </div>
                    {!isEditing && (
                      <Button variant="outline" size="sm" onClick={startEditing}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Hourly Rate ($)</Label>
                          <Input
                            type="number"
                            value={editForm.hourly_rate}
                            onChange={(e) => setEditForm({ ...editForm, hourly_rate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Portfolio URL</Label>
                          <Input
                            type="url"
                            value={editForm.portfolio_url}
                            onChange={(e) => setEditForm({ ...editForm, portfolio_url: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Skills</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a skill"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                          />
                          <Button type="button" variant="outline" size="icon" onClick={addSkill}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {editForm.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {editForm.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="pr-1">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive">
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button onClick={saveProfile} disabled={updateProfile.isPending}>
                          {updateProfile.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : null}
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-primary">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="font-semibold">{profile.rating?.toFixed(1) || "0.0"}</span>
                          <span className="text-muted-foreground">({profile.total_jobs || 0} jobs)</span>
                        </div>
                        {profile.hourly_rate && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            <span>${profile.hourly_rate}/hr</span>
                          </div>
                        )}
                      </div>

                      {profile.bio && <p className="text-muted-foreground">{profile.bio}</p>}

                      {profile.skills && profile.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {profile.portfolio_url && (
                        <a
                          href={profile.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Portfolio
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Services</h2>
                  <Button onClick={() => setAddServiceOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </div>

                {servicesLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : services.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="font-semibold mb-2">No services yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Add your first service to start receiving orders
                      </p>
                      <Button onClick={() => setAddServiceOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Service
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {services.map((service) => (
                      <Card key={service.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{service.title}</CardTitle>
                              {service.category && (
                                <Badge variant="outline" className="mt-1">
                                  {service.category}
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {service.description && (
                            <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 font-semibold text-primary">
                              <DollarSign className="w-4 h-4" />
                              {service.price}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {service.delivery_days} days
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AddServiceDialog
        open={addServiceOpen}
        onOpenChange={setAddServiceOpen}
        freelancerId={profile.id}
      />

      <Footer />
    </div>
  );
};

export default FreelancerDashboard;
