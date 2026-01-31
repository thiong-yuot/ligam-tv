import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useCreatorProfile } from "@/hooks/useCreatorProfile";
import { useFollowers } from "@/hooks/useFollowers";
import { useStreams } from "@/hooks/useStreams";
import StreamCard from "@/components/StreamCard";
import { Users, Video, Heart, MessageCircle, CheckCircle, ExternalLink } from "lucide-react";

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, isLoading } = useCreatorProfile(username);
  const { isFollowing, toggleFollow, followersCount } = useFollowers(profile?.user_id);
  const { streams } = useStreams({ userId: profile?.user_id });
  const [activeTab, setActiveTab] = useState("streams");

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-2xl font-bold">User Not Found</h1>
          <p className="text-muted-foreground">The user @{username} doesn't exist.</p>
          <Button onClick={() => navigate("/browse")}>Browse Streams</Button>
        </div>
      </Layout>
    );
  }

  const isOwnProfile = user?.id === profile.user_id;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-3xl">
                  {profile.display_name?.slice(0, 2).toUpperCase() || "??"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{profile.display_name}</h1>
                  {profile.is_verified && (
                    <CheckCircle className="h-6 w-6 text-primary fill-primary" />
                  )}
                </div>
                <p className="text-muted-foreground mb-4">@{profile.username}</p>

                {profile.bio && (
                  <p className="text-sm md:text-base mb-4 max-w-2xl">{profile.bio}</p>
                )}

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{followersCount || profile.follower_count || 0}</span>
                    <span className="text-muted-foreground">followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{profile.following_count || 0}</span>
                    <span className="text-muted-foreground">following</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{streams?.length || 0}</span>
                    <span className="text-muted-foreground">streams</span>
                  </div>
                </div>

                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline mt-4"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {profile.website}
                  </a>
                )}
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                {isOwnProfile ? (
                  <Button onClick={() => navigate("/dashboard")} className="w-full md:w-auto">
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={toggleFollow}
                      variant={isFollowing ? "outline" : "default"}
                      className="w-full md:w-auto"
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="streams">Streams</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="streams">
            {streams?.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-semibold mb-2">No Streams Yet</h3>
                  <p className="text-muted-foreground">
                    {isOwnProfile
                      ? "Start your first stream to share with your audience!"
                      : `${profile.display_name} hasn't streamed yet.`}
                  </p>
                  {isOwnProfile && (
                    <Button className="mt-4" onClick={() => navigate("/go-live")}>
                      Go Live
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {streams?.map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About {profile.display_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.bio ? (
                  <p>{profile.bio}</p>
                ) : (
                  <p className="text-muted-foreground">No bio available.</p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{profile.total_views || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{streams?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Streams</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{followersCount || profile.follower_count || 0}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{profile.following_count || 0}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserProfile;
