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
              Last updated: February 23, 2026
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
                <p className="mb-3">We collect information across the following categories:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong className="text-foreground">Account Information</strong> — Email, display name, username, avatar, and profile details provided during registration.</li>
                  <li><strong className="text-foreground">Creator Data</strong> — Freelancer profiles, service listings, course content, product listings, stream metadata, and identity verification documents.</li>
                  <li><strong className="text-foreground">Transaction Data</strong> — Purchase history, subscription tier, earnings, withdrawal requests, and payment information processed via Stripe.</li>
                  <li><strong className="text-foreground">Usage Data</strong> — Device information, IP address, browser type, pages visited, streams watched, and interaction data (likes, comments, tips).</li>
                  <li><strong className="text-foreground">Communications</strong> — Messages between users, contact form submissions, and support inquiries.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Provide and operate the platform (streaming, Shop, Services, Courses, and community features)</li>
                  <li>Process payments, calculate creator earnings, and apply platform commission rates on transactions</li>
                  <li>Operate the free platform and enforce commission-based revenue model</li>
                  <li>Verify creator identity for monetization and withdrawals</li>
                  <li>Personalize content recommendations and search results</li>
                  <li>Communicate service updates, billing notifications, and promotional content</li>
                  <li>Ensure platform safety, prevent fraud, and enforce our Terms of Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
                <p className="mb-3">We may share your information with:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong className="text-foreground">Payment Processors</strong> — Stripe processes all payments, subscriptions, and creator payouts.</li>
                  <li><strong className="text-foreground">Service Providers</strong> — Infrastructure and analytics partners who help us operate the platform.</li>
                  <li><strong className="text-foreground">Other Users</strong> — Your public profile, streams, products, services, and courses are visible to other users as configured by your privacy settings.</li>
                  <li><strong className="text-foreground">Legal Compliance</strong> — When required by law or to protect our rights and users' safety.</li>
                </ul>
                <p className="mt-3">We do not sell your personal information to third parties.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
                <p>
                  We implement industry-standard security measures including encryption in transit and at rest, 
                  row-level security policies on all database tables, secure authentication with email verification, 
                  and regular security audits. Identity verification documents are stored securely and access is 
                  strictly limited.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
                <p className="mb-3">
                  Depending on your location, you may have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Access, correct, or delete your personal data</li>
                  <li>Export your data (data portability)</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request deletion of your account and associated data</li>
                  <li>Withdraw consent for optional data processing</li>
                </ul>
                <p className="mt-3">Contact us at privacy@ligam.tv to exercise these rights.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies &amp; Tracking</h2>
                <p>
                  We use cookies and similar technologies for authentication, session management, preferences, 
                  and analytics. You can manage cookie preferences through your browser settings. 
                  See our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a> for full details.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Children's Privacy</h2>
                <p>
                  Our Service is not intended for users under 13. We do not knowingly collect information 
                  from children under 13. If we become aware of such collection, we will delete it promptly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Data Retention</h2>
                <p>
                  We retain your personal data for as long as your account is active or as needed to provide 
                  our services. Transaction records and earnings data are retained as required by applicable 
                  tax and financial regulations. You may request deletion of your account data at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. International Transfers</h2>
                <p>
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place for such transfers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Us</h2>
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
