import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Cookie } from "lucide-react";

const Cookies = () => {
  const cookieTypes = [
    {
      name: "Essential Cookies",
      description: "Required for the website to function properly. Cannot be disabled.",
      examples: ["Authentication", "Security", "Session management"],
    },
    {
      name: "Performance Cookies",
      description: "Help us understand how visitors interact with our website.",
      examples: ["Analytics", "Page load times", "Error tracking"],
    },
    {
      name: "Functional Cookies",
      description: "Enable enhanced functionality and personalization.",
      examples: ["Language preferences", "Theme settings", "User preferences"],
    },
    {
      name: "Advertising Cookies",
      description: "Used to deliver relevant advertisements and track ad performance.",
      examples: ["Ad targeting", "Conversion tracking", "Remarketing"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Cookie className="w-4 h-4" />
              Legal
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
              Cookie Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: December 28, 2024
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies?</h2>
              <p className="text-muted-foreground">
                Cookies are small text files stored on your device when you visit a website. 
                They help us remember your preferences, understand how you use our platform, 
                and improve your experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Types of Cookies We Use</h2>
              <div className="space-y-4">
                {cookieTypes.map((type, index) => (
                  <Card key={index} className="p-6 bg-card border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {type.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">{type.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {type.examples.map((example, i) => (
                        <span 
                          key={i}
                          className="text-sm bg-secondary text-muted-foreground px-3 py-1 rounded-full"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Cookies</h2>
              <p className="text-muted-foreground mb-4">
                You can control and manage cookies through your browser settings. Most browsers 
                allow you to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>View what cookies are stored on your device</li>
                <li>Delete all or specific cookies</li>
                <li>Block cookies from specific sites</li>
                <li>Block all third-party cookies</li>
                <li>Clear all cookies when you close your browser</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Cookies</h2>
              <p className="text-muted-foreground">
                We may use third-party services that set their own cookies, including analytics 
                providers, advertising networks, and social media platforms. These cookies are 
                governed by the respective third parties' privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time. We will notify you of any 
                significant changes by posting a notice on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about our use of cookies, please contact us at privacy@ligam.tv.
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cookies;
