import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCreateFreelancerProfile } from "@/hooks/useFreelancerProfile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Plus } from "lucide-react";
import { toast } from "sonner";

interface BecomeFreelancerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BecomeFreelancerDialog = ({ open, onOpenChange }: BecomeFreelancerDialogProps) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const createProfile = useCreateFreelancerProfile();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // Pre-fill from existing profile
  useEffect(() => {
    if (open && profile) {
      if (!name) setName(profile.display_name || "");
      if (!bio) setBio(profile.bio || "");
    }
  }, [open, profile]);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to become a freelancer");
      navigate("/login");
      return;
    }

    if (!name.trim() || !title.trim()) {
      toast.error("Name and title are required");
      return;
    }

    try {
      await createProfile.mutateAsync({
        name: name.trim(),
        title: title.trim(),
        bio: bio.trim() || undefined,
        skills: skills.length > 0 ? skills : undefined,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        portfolio_url: portfolioUrl.trim() || undefined,
      });

      toast.success("Welcome to the freelance marketplace!");
      onOpenChange(false);
      navigate("/dashboard?tab=freelance");
    } catch (error: any) {
      toast.error(error.message || "Failed to create profile");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Become a Freelancer</DialogTitle>
          <DialogDescription>
            Create your freelancer profile and start offering services to streamers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name *</Label>
            <Input
              id="name"
              placeholder="Your professional name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Professional Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Video Editor, Graphic Designer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell clients about yourself and your experience..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
            />
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
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="pr-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
            <Input
              id="hourlyRate"
              type="number"
              placeholder="50"
              min="0"
              step="0.01"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioUrl">Portfolio URL</Label>
            <Input
              id="portfolioUrl"
              type="url"
              placeholder="https://yourportfolio.com"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={createProfile.isPending}>
              {createProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Profile"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BecomeFreelancerDialog;
