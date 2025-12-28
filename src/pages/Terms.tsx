import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              Legal
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: December 28, 2024
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using Ligam.tv ("the Service"), you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
                <p>
                  Ligam.tv is a live streaming platform that allows users to broadcast and view live video content, 
                  interact with other users, and participate in our creator monetization program.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Accounts</h2>
                <p>
                  You must be at least 13 years old to use the Service. You are responsible for maintaining 
                  the confidentiality of your account credentials and for all activities under your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. User Content</h2>
                <p>
                  You retain ownership of content you create and share on Ligam.tv. By posting content, 
                  you grant us a non-exclusive, worldwide license to use, display, and distribute your content 
                  on our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Prohibited Conduct</h2>
                <p>
                  You agree not to violate our Community Guidelines, engage in illegal activities, 
                  harass other users, or attempt to circumvent our security measures.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Monetization</h2>
                <p>
                  Creators may earn revenue through our monetization program subject to meeting eligibility 
                  requirements and agreeing to our Creator Terms. We reserve the right to modify payment 
                  terms with reasonable notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Termination</h2>
                <p>
                  We may suspend or terminate your account for violations of these Terms or our 
                  Community Guidelines. You may delete your account at any time through your account settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Disclaimers</h2>
                <p>
                  The Service is provided "as is" without warranties of any kind. We do not guarantee 
                  uninterrupted service or that the platform will be free of errors.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contact</h2>
                <p>
                  For questions about these Terms, please contact us at legal@ligam.tv.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
