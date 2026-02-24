import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  const sections = [
    { title: "1. Information We Collect", content: "Account Information (email, display name, avatar), Creator Data (profiles, listings, courses, streams, identity documents), Transaction Data (purchases, earnings, withdrawals via Stripe), Usage Data (device info, pages visited, interaction data), and Communications (messages, support inquiries)." },
    { title: "2. How We Use Your Information", content: "We use your data to operate the platform, process payments, verify creator identity, personalize content, communicate updates, and ensure platform safety." },
    { title: "3. Information Sharing", content: "We share data with payment processors (Stripe), service providers, other users (public content), and for legal compliance. We do not sell your personal information." },
    { title: "4. Data Security", content: "We implement encryption in transit and at rest, row-level security policies, secure authentication with email verification, and regular security audits." },
    { title: "5. Your Rights", content: "You may access, correct, or delete your personal data, export your data, opt out of marketing, request account deletion, and withdraw consent. Contact privacy@ligam.tv to exercise these rights." },
    { title: "6. Cookies & Tracking", content: "We use cookies for authentication, session management, preferences, and analytics. See our Cookie Policy for details." },
    { title: "7. Children's Privacy", content: "Our Service is not intended for users under 13. We do not knowingly collect information from children under 13." },
    { title: "8. Data Retention", content: "We retain data while your account is active. Transaction records are retained as required by tax regulations. You may request deletion at any time." },
    { title: "9. International Transfers", content: "Your information may be transferred to and processed in countries other than your own with appropriate safeguards." },
    { title: "10. Contact Us", content: "For privacy questions, contact our Data Protection Officer at privacy@ligam.tv." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-lg font-display font-bold text-foreground mb-1">Privacy Policy</h1>
          <p className="text-[11px] text-muted-foreground mb-6">Last updated: February 23, 2026</p>
          <div className="space-y-5">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="text-xs font-semibold text-foreground mb-1.5">{s.title}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.content}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
