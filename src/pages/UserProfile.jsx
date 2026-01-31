import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useFollowers } from "@/hooks/useFollowers";
import { supabase } from "@/integrations/supabase/client";
import StreamCard from "@/components/StreamCard";
import { Users, Video, CheckCircle, ExternalLink } from "lucide-react";

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isFollowing, followersCount, toggleFollow, isLoading: followLoading } = useFollowers(
    profile?.user_id
  );

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Fetch user's streams
      const { data: streamsData } = await supabase
        .from("streams")
        .select("*")
        .eq("user_id", profileData.user_id)
        .order("created_at", { ascending: false })
        .limit(12);

      setStreams(streamsData || []);
      setLoading(false);
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <p className="text-muted-foreground mb-6">
            The user @{username} doesn't exist
          </p>
          <Button onClick={() => navigate("/browse")}>Browse Streams</Button>
        </div>
      </Layout>
    );
  }

  const isOwnProfile = user?.id === profile.user_id;
  const liveStreams = streams.filter(s => s.is_live);
  const pastStreams = streams.filter(s => !s.is_live);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-4xl">
                  {profile.display_name?.[0] || username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{profile.display_name || username}</h1>
                  {profile.is_verified && (
                    <CheckCircle className="h-5 w-5 text-primary fill-primary" />
                  )}
                </div>
                <p className="text-muted-foreground mb-4">@{profile.username}</p>

                {profile.bio && (
                  <p className="text-muted-foreground mb-4 max-w-2xl">{profile.bio}</p>
                )}

                <div className="flex items-center justify-center md:justify-start gap-6 mb-4">
                  <div className="text-center">
                    <p className="text-xl font-bold">{followersCount}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{profile.following_count || 0}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{profile.total_views || 0}</p>
                    <p className="text-sm text-muted-foreground">Views</p>
                  </div>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3">
                  {isOwnProfile ? (
                    <Button onClick={() => navigate("/dashboard")}>
                      Edit Profile
                    </Button>
                  ) : (
                    <Button
                      onClick={toggleFollow}
                      disabled={followLoading || !user}
                      variant={isFollowing ? "outline" : "default"}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  )}

                  {profile.website && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(profile.website, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Website
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="streams">
          <TabsList className="mb-6">
            <TabsTrigger value="streams">
              <Video className="h-4 w-4 mr-2" />
              Streams ({streams.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="streams">
            {/* Live Streams */}
            {liveStreams.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                  Currently Streaming
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveStreams.map((stream) => (
                    <StreamCard
                      key={stream.id}
                      id={stream.id}
                      title={stream.title}
                      thumbnailUrl={stream.thumbnail_url}
                      streamerName={profile.display_name || username}
                      streamerAvatar={profile.avatar_url}
                      viewerCount={stream.viewer_count}
                      isLive={stream.is_live}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Streams */}
            {pastStreams.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Past Streams</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {pastStreams.map((stream) => (
                    <StreamCard
                      key={stream.id}
                      id={stream.id}
                      title={stream.title}
                      thumbnailUrl={stream.thumbnail_url}
                      streamerName={profile.display_name || username}
                      streamerAvatar={profile.avatar_url}
                      viewerCount={stream.total_views}
                      isLive={false}
                    />
                  ))}
                </div>
              </div>
            ) : liveStreams.length === 0 ? (
              <div className="text-center py-12">
                <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No streams yet</p>
              </div>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserProfile;
