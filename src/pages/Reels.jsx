import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Plus } from "lucide-react";

const Reels = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Reels
              </h1>
              <p className="text-muted-foreground mt-1">
                Short-form video content
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Reel
            </Button>
          </div>

          <Card>
            <CardContent className="py-16 text-center">
              <Film className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Coming Soon
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Short-form video reels are coming soon. Create and share quick, engaging content with your audience.
              </p>
              <Button disabled>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Reel
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Reels;
