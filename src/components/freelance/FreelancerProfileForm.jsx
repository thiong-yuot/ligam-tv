import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Plus, Upload, Image, Link as LinkIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuth } from "@/hooks/useAuth";

export const FreelancerProfileForm = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const { user } = useAuth();
  const { uploadFile, uploadMultipleFiles, uploading } = useFileUpload();
  const avatarInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const portfolioInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    title: initialData?.title || "",
    bio: initialData?.bio || "",
    skills: initialData?.skills || [],
    portfolio_url: initialData?.portfolio_url || "",
    avatar_url: initialData?.avatar_url || "",
    thumbnail_url: initialData?.thumbnail_url || "",
    portfolio_images: initialData?.portfolio_images || [],
  });

  const [newSkill, setNewSkill] = useState("");

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const url = await uploadFile(file, "freelancer-portfolios", user.id);
    if (url) setFormData((prev) => ({ ...prev, avatar_url: url }));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const url = await uploadFile(file, "freelancer-portfolios", user.id);
    if (url) setFormData((prev) => ({ ...prev, thumbnail_url: url }));
  };

  const handlePortfolioUpload = async (e) => {
    const files = e.target.files;
    if (!files || !user) return;
    const urls = await uploadMultipleFiles(
      Array.from(files),
      "freelancer-portfolios",
      user.id
    );
    setFormData((prev) => ({
      ...prev,
      portfolio_images: [...prev.portfolio_images, ...urls],
    }));
  };

  const removePortfolioImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      portfolio_images: prev.portfolio_images.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar_url} />
              <AvatarFallback>{formData.name.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Upload Avatar"}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                placeholder="e.g., Video Editor, Graphic Designer"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell clients about your experience and expertise..."
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio_url">Portfolio URL</Label>
            <div className="flex gap-2">
              <LinkIcon className="h-5 w-5 text-muted-foreground mt-2" />
              <Input
                id="portfolio_url"
                type="url"
                placeholder="https://yourportfolio.com"
                value={formData.portfolio_url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, portfolio_url: e.target.value }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            />
            <Button type="button" onClick={addSkill} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeSkill(skill)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thumbnail & Portfolio Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Thumbnail */}
          <div className="space-y-2">
            <Label>Profile Thumbnail</Label>
            <div className="flex items-center gap-4">
              {formData.thumbnail_url && (
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail"
                  className="h-24 w-40 object-cover rounded-lg"
                />
              )}
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => thumbnailInputRef.current?.click()}
                disabled={uploading}
              >
                <Image className="h-4 w-4 mr-2" />
                {formData.thumbnail_url ? "Change Thumbnail" : "Upload Thumbnail"}
              </Button>
            </div>
          </div>

          {/* Portfolio Images */}
          <div className="space-y-2">
            <Label>Portfolio Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.portfolio_images.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Portfolio ${index + 1}`}
                    className="h-32 w-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePortfolioImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <input
                ref={portfolioInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePortfolioUpload}
              />
              <button
                type="button"
                className="h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                onClick={() => portfolioInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-6 w-6" />
                <span className="text-sm">Add Images</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isLoading || uploading}>
        {isLoading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
};