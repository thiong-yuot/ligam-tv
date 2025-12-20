import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I start streaming on Ligam.tv?",
    answer: "Getting started is easy! Create a free account, download our streaming software or use your preferred broadcasting tool (OBS, Streamlabs, etc.), and connect it to your Ligam channel using your unique stream key found in your dashboard."
  },
  {
    question: "What are the requirements to monetize my stream?",
    answer: "To start earning on Ligam, you need to: be at least 18 years old, have at least 100 followers, stream for at least 10 hours in the last 30 days, and complete our creator verification process."
  },
  {
    question: "How do virtual gifts work?",
    answer: "Viewers can purchase virtual gifts (Hearts, Sparkles, Crowns, Rockets) and send them during your stream. As a creator, you earn a percentage of each gift's value. Gifts are converted to your local currency and paid out monthly."
  },
  {
    question: "What video quality is supported?",
    answer: "Free accounts support up to 720p streaming. Creator plans support 1080p HD, and Pro plans support up to 4K streaming. The actual quality depends on your internet upload speed and encoding settings."
  },
  {
    question: "Can I stream to multiple platforms?",
    answer: "Yes! With our Pro plan, you can simulcast to multiple platforms including YouTube, Twitch, and Facebook Gaming while streaming on Ligam.tv."
  },
  {
    question: "How does the Get Featured promotion work?",
    answer: "Our Get Featured program gives your stream premium placement on the homepage carousel and category pages for increased visibility. You can purchase promotion packages based on duration and placement tier."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major credit cards, PayPal, and cryptocurrency payments. For creator payouts, we support bank transfers, PayPal, and various regional payment methods."
  },
  {
    question: "Is there a mobile app?",
    answer: "Yes! Our mobile apps for iOS and Android allow you to watch streams, chat, send gifts, and even go live directly from your phone."
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about Ligam.tv
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="text-center mt-12 p-8 bg-card border border-border rounded-xl">
            <h3 className="text-xl font-display font-bold text-foreground mb-2">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help
            </p>
            <a 
              href="mailto:support@ligam.tv" 
              className="text-primary font-semibold hover:underline"
            >
              support@ligam.tv
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
