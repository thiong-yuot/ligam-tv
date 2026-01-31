import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Newspaper, 
  Download, 
  Mail,
  ExternalLink,
  Image,
  FileText,
  Loader2
} from "lucide-react";
import { usePressReleases } from "@/hooks/usePress";

const Press = () => {
  const { data: pressReleases, isLoading } = usePressReleases();

  const mediaKitItems = [
    { icon: Image, title: "Logo Pack", description: "High-resolution logos in various formats" },
    { icon: FileText, title: "Brand Guidelines", description: "Complete brand usage documentation" },
    { icon: Image, title: "Screenshots", description: "Platform screenshots and mockups" },
    { icon: FileText, title: "Fact Sheet", description: "Company facts and information" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Newspaper className="w-4 h-4" />
            Press
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            Press & <span className="text-primary">Media</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            News, updates, and resources for media coverage of Ligam.tv
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-card/30 border-y border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Media Kit
              </h2>
              <p className="text-muted-foreground">
                Download our official brand assets
              </p>
            </div>
            <Button variant="default" className="gap-2">
              <Download className="w-4 h-4" />
              Download Full Kit
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mediaKitItems.map((item, index) => (
              <Card 
                key={index} 
                className="p-6 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8">
            Latest News
          </h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : pressReleases && pressReleases.length > 0 ? (
            <div className="space-y-4">
              {pressReleases.map((release) => (
                <Card 
                  key={release.id} 
                  className="p-6 bg-card border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-sm text-primary mb-2 block">
                        {new Date(release.published_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {release.title}
                      </h3>
                      <p className="text-muted-foreground">{release.summary}</p>
                    </div>
                    <Button variant="ghost" className="gap-2 flex-shrink-0">
                      Read More
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No press releases available yet</p>
              <p className="text-sm text-muted-foreground">Check back soon for the latest news</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 bg-card/30 border-t border-border">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">
            Media Inquiries
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            For press inquiries, interviews, or additional information, please contact our media team.
          </p>
          <Button variant="default" size="lg" className="gap-2">
            <Mail className="w-5 h-5" />
            press@ligam.tv
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Press;
