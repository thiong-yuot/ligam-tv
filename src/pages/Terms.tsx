import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  const sections = [
    { title: "1. Acceptance of Terms", content: "By accessing or using Ligam.tv (the \"Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service." },
    { title: "2. Description of Service", content: "Ligam.tv is a unified creative platform that enables users to live stream, sell products through our integrated Shop, offer freelance Services, teach and enroll in Courses, and engage with a global community of creators and viewers. All platform tools and features are provided free of charge to all users." },
    { title: "3. User Accounts", content: "You must be at least 13 years old to use the Service. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Email verification is required before you can access your account." },
    { title: "4. Free Platform Model", content: "Ligam.tv provides all tools and features completely free of charge. There are no subscription tiers or paid plans. Every user has full access to unlimited streaming (including HD & 4K), Go Live and Paid Live Streaming, unlimited store products, unlimited courses, full freelance service access, and stream analytics. Ligam.tv generates revenue through commission fees on successful transactions." },
    { title: "5. Creator Monetization & Platform Fees", content: "Creators may earn revenue through multiple channels. Ligam.tv retains a platform commission on each successful transaction: Shop/Store Sales — 20%, Freelance Services — 25%, Courses, Paid Live Sessions, Tips, Creator Tokens & Gifts, Channel Subscriptions — 40%. Earnings are subject to identity verification before withdrawal." },
    { title: "6. User Content", content: "You retain ownership of content you create and share on Ligam.tv. By posting content, you grant us a non-exclusive, worldwide license to use, display, and distribute your content on our platform." },
    { title: "7. Prohibited Conduct", content: "You agree not to violate our Community Guidelines, engage in illegal activities, harass other users, manipulate platform metrics, or attempt to circumvent our security measures or commission structure." },
    { title: "8. Termination", content: "We may suspend or terminate your account for violations of these Terms or our Community Guidelines. You may delete your account at any time. Pending earnings will be processed according to our withdrawal policy." },
    { title: "9. Disclaimers", content: "The Service is provided \"as is\" without warranties of any kind. We do not guarantee uninterrupted service or that the platform will be free of errors." },
    { title: "10. Contact", content: "For questions about these Terms, please contact us at legal@ligam.tv." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-lg font-display font-bold text-foreground mb-1">Terms of Service</h1>
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

export default Terms;
