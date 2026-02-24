import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cookies = () => {
  const cookieTypes = [
    { name: "Essential", desc: "Authentication, security, session management. Cannot be disabled.", },
    { name: "Performance", desc: "Analytics, page load times, error tracking.", },
    { name: "Functional", desc: "Language preferences, theme settings, user preferences.", },
    { name: "Advertising", desc: "Ad targeting, conversion tracking, remarketing.", },
  ];

  const sections = [
    { title: "What Are Cookies?", content: "Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your experience." },
    { title: "Managing Cookies", content: "You can control cookies through your browser settings: view stored cookies, delete specific cookies, block cookies from specific sites, block all third-party cookies, or clear all cookies when closing your browser." },
    { title: "Third-Party Cookies", content: "We may use third-party services that set their own cookies, including analytics providers and advertising networks. These are governed by their respective privacy policies." },
    { title: "Updates", content: "We may update this Cookie Policy from time to time. Significant changes will be posted on our website." },
    { title: "Contact", content: "Questions about cookies? Contact us at privacy@ligam.tv." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-lg font-display font-bold text-foreground mb-1">Cookie Policy</h1>
          <p className="text-[11px] text-muted-foreground mb-6">Last updated: February 23, 2026</p>

          <section className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Cookie Types</h2>
            <div className="grid grid-cols-2 gap-2">
              {cookieTypes.map((c) => (
                <div key={c.name} className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-xs font-medium text-foreground mb-0.5">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

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

export default Cookies;
