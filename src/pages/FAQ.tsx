import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFAQs } from "@/hooks/useFAQs";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const { data: faqs, isLoading } = useFAQs();

  const groupedFaqs = faqs?.reduce((acc, faq) => {
    const category = faq.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">

          <h1 className="text-lg font-display font-bold text-foreground mb-1">FAQ</h1>
          <p className="text-xs text-muted-foreground mb-6">Common questions about Ligam.tv</p>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : groupedFaqs && Object.keys(groupedFaqs).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
                <div key={category}>
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{category}</h2>
                  <Accordion type="single" collapsible className="space-y-1">
                    {categoryFaqs?.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="bg-card border border-border rounded-lg px-3 data-[state=open]:border-primary/50"
                      >
                        <AccordionTrigger className="text-left text-xs font-medium text-foreground hover:text-primary py-2.5">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground pb-3">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No FAQs available yet.</p>
            </div>
          )}

          {/* Footer links */}
          <div className="text-center mt-8 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Still have questions?</p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/contact" className="text-xs text-primary hover:underline font-medium">Contact Support</Link>
              <span className="text-border">·</span>
              <Link to="/help" className="text-xs text-primary hover:underline font-medium">Help Center</Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
