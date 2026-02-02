import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Legal
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: December 28, 2024
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
                <p>
                  We collect information you provide directly (account details, profile information, content), 
                  automatically collected data (usage data, device information, cookies), and information 
                  from third parties (social login providers, payment processors).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
                <p>
                  We use your information to provide and improve our services, personalize your experience, 
                  process payments, communicate with you, and ensure platform safety and security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
                <p>
                  We may share your information with service providers, business partners (with consent), 
                  for legal compliance, and in connection with business transfers. We do not sell your 
                  personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your data, including 
                  encryption, secure servers, and regular security audits. However, no system is 
                  completely secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
                <p>
                  Depending on your location, you may have rights to access, correct, delete, or port 
                  your data, opt out of certain processing, and withdraw consent. Contact us to exercise 
                  these rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies</h2>
                <p>
                  We use cookies and similar technologies for authentication, preferences, analytics, 
                  and advertising. You can manage cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Children's Privacy</h2>
                <p>
                  Our Service is not intended for users under 13. We do not knowingly collect information 
                  from children under 13. If we become aware of such collection, we will delete it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. International Transfers</h2>
                <p>
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place for such transfers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contact Us</h2>
                <p>
                  For privacy-related questions or to exercise your rights, contact our Data Protection 
                  Officer at privacy@ligam.tv.
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

export default Privacy;
