import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, HelpCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

const HelpArticle = () => {
  const { id } = useParams();
  const [helpful, setHelpful] = useState(null);

  const { data: article, isLoading } = useQuery({
    queryKey: ["help-article", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("help_articles")
        .select("*, help_categories(name, slug)")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleHelpful = (isHelpful) => {
    setHelpful(isHelpful);
    toast.success("Thank you for your feedback!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <Link 
            to={article?.help_categories ? `/help/${article.help_categories.slug}` : "/help"} 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {article?.help_categories ? `Back to ${article.help_categories.name}` : "Back to Help Center"}
          </Link>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <div className="space-y-2 mt-8">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ) : article ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  {article.title}
                </h1>
                {article.summary && (
                  <p className="text-lg text-muted-foreground">
                    {article.summary}
                  </p>
                )}
              </div>

              <Card className="p-8 bg-card border-border mb-8">
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {article.content}
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-foreground font-medium">Was this article helpful?</p>
                  <div className="flex gap-3">
                    <Button
                      variant={helpful === true ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleHelpful(true)}
                      className="gap-2"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Yes
                    </Button>
                    <Button
                      variant={helpful === false ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleHelpful(false)}
                      className="gap-2"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      No
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="mt-12 text-center p-8 bg-card/50 border border-border rounded-xl">
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  Still need help?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Our support team is ready to assist you
                </p>
                <Link to="/contact">
                  <Button>Contact Support</Button>
                </Link>
              </div>
            </>
          ) : (
            <Card className="p-8 bg-card border-border text-center">
              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Article not found.</p>
              <Link to="/help">
                <Button variant="outline" className="mt-4">
                  Go to Help Center
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpArticle;
