import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, HelpCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

const HelpArticle = () => {
  const { id } = useParams<{ id: string }>();
  const [helpful, setHelpful] = useState<boolean | null>(null);

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

  const handleHelpful = (isHelpful: boolean) => {
    setHelpful(isHelpful);
    toast.success("Thank you for your feedback!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">

          <Link
            to={article?.help_categories ? `/help/${article.help_categories.slug}` : "/help"}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-3 h-3" />
            {article?.help_categories ? article.help_categories.name : "Help Center"}
          </Link>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
              <div className="space-y-2 mt-4">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ) : article ? (
            <>
              <h1 className="text-lg font-display font-bold text-foreground mb-1">{article.title}</h1>
              {article.summary && (
                <p className="text-xs text-muted-foreground mb-4">{article.summary}</p>
              )}

              <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap mb-6">
                {article.content}
              </div>

              {/* Feedback */}
              <div className="flex items-center gap-3 py-3 border-t border-border">
                <span className="text-xs text-muted-foreground">Helpful?</span>
                <Button variant={helpful === true ? "default" : "outline"} size="sm" onClick={() => handleHelpful(true)} className="h-7 gap-1 text-[11px]">
                  <ThumbsUp className="w-3 h-3" /> Yes
                </Button>
                <Button variant={helpful === false ? "default" : "outline"} size="sm" onClick={() => handleHelpful(false)} className="h-7 gap-1 text-[11px]">
                  <ThumbsDown className="w-3 h-3" /> No
                </Button>
              </div>

              <div className="text-center mt-6 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Still need help?</p>
                <Link to="/contact" className="text-xs text-primary hover:underline font-medium">Contact Support</Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-3">Article not found.</p>
              <Link to="/help" className="text-xs text-primary hover:underline font-medium">Back to Help Center</Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpArticle;
