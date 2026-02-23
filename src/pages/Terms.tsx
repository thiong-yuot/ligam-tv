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
              Last updated: February 23, 2026
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
                  Ligam.tv is a unified creative platform that enables users to live stream, sell products 
                  through our integrated Shop, offer freelance Services, teach and enroll in Courses, 
                  and engage with a global community of creators and viewers. All platform tools and features 
                  are provided free of charge to all users.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Accounts</h2>
                <p>
                  You must be at least 13 years old to use the Service. You are responsible for maintaining 
                  the confidentiality of your account credentials and for all activities under your account. 
                  Email verification is required before you can access your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Free Platform Model</h2>
                <p className="mb-3">
                  Ligam.tv provides all tools and features completely free of charge. There are no subscription 
                  tiers or paid plans. Every user has full access to:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Unlimited streaming (including HD &amp; 4K)</li>
                  <li>Go Live and Paid Live Streaming capabilities</li>
                  <li>Unlimited store products</li>
                  <li>Unlimited courses</li>
                  <li>Full freelance service access</li>
                  <li>Stream analytics and all platform tools</li>
                </ul>
                <p className="mt-3">
                  Ligam.tv generates revenue through commission fees on successful transactions, 
                  as outlined in Section 5.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Creator Monetization &amp; Platform Fees</h2>
                <p className="mb-3">
                  Creators may earn revenue through multiple channels on the platform. Ligam.tv retains a platform 
                  commission on each successful transaction as follows:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong className="text-foreground">Shop / Store Sales</strong> — 20% platform fee (creator keeps 80%)</li>
                  <li><strong className="text-foreground">Freelance Services</strong> — 25% platform fee (creator keeps 75%)</li>
                  <li><strong className="text-foreground">Courses</strong> — 40% platform fee (creator keeps 60%)</li>
                  <li><strong className="text-foreground">Paid Live Sessions</strong> — 40% platform fee (creator keeps 60%)</li>
                  <li><strong className="text-foreground">Tips, Creator Tokens &amp; Gifts</strong> — 40% platform fee (creator keeps 60%)</li>
                  <li><strong className="text-foreground">Channel Subscriptions</strong> — 40% platform fee (creator keeps 60%)</li>
                </ul>
                <p className="mt-3">
                  Earnings are subject to identity verification before withdrawal. We reserve the right to modify 
                  commission rates with reasonable notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. User Content</h2>
                <p>
                  You retain ownership of content you create and share on Ligam.tv, including streams, posts, 
                  courses, products, and service listings. By posting content, you grant us a non-exclusive, 
                  worldwide license to use, display, and distribute your content on our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Prohibited Conduct</h2>
                <p>
                  You agree not to violate our Community Guidelines, engage in illegal activities, 
                  harass other users, manipulate platform metrics, or attempt to circumvent our security measures 
                  or commission structure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Termination</h2>
                <p>
                  We may suspend or terminate your account for violations of these Terms or our 
                  Community Guidelines. You may delete your account at any time through your account settings. 
                  Pending earnings will be processed according to our withdrawal policy upon account closure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Disclaimers</h2>
                <p>
                  The Service is provided "as is" without warranties of any kind. We do not guarantee 
                  uninterrupted service or that the platform will be free of errors.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact</h2>
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
