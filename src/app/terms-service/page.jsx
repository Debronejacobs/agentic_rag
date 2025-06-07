
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';

const companyName = "TuriqAI";
const supportEmail = "turiqai@gmail.com";
const effectiveDate = "2025";
const yourCountry = "Kenya";

const termsData = {
  title: "Terms of Service",
  effectiveDate,
  introduction: [
    `Welcome to ${companyName}. These Terms of Service ("Terms") govern your access to and use of our services, including the web app, AI WhatsApp integration, and related features (collectively, the "Service").`,
    `By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, you may not use our Service.`
  ],
  sections: [
    {
      id: "use",
      title: "1. Use of Service",
      content: [
        "You may use the Service only in compliance with these Terms and all applicable local, national, and international laws.",
        "You must be at least 18 years old or have the legal capacity to enter into these Terms to use our Service."
      ]
    },
    {
      id: "account",
      title: "2. Account Registration",
      content: [
        "To use certain features of the Service, you must register using Google Sign-In and provide accurate and complete information.",
        "You are responsible for maintaining the confidentiality of your login credentials and are fully responsible for all activities under your account."
      ]
    },
    {
      id: "ai-and-content",
      title: "3. AI-Generated Content and Business Data",
      content: [
        "The AI assistant is powered by large language models and may generate responses based on your uploaded content. We do not guarantee the accuracy or reliability of AI-generated messages.",
        "You retain ownership of your uploaded business content. By using our Service, you grant us a limited license to process and store this data for the sole purpose of providing the Service."
      ]
    },
    {
      id: "restrictions",
      title: "4. Prohibited Uses",
      content: [
        "You agree not to use the Service to:",
      ],
      points: [
        "Engage in unlawful, misleading, or harmful behavior.",
        "Transmit malicious software or viruses.",
        "Abuse or misuse the AI assistant to generate or spread harmful, illegal, or unethical content.",
        "Infringe on the intellectual property rights of others."
      ]
    },
    {
      id: "termination",
      title: "5. Termination",
      content: [
        "We may suspend or terminate your access to the Service at our discretion, without notice, if you violate these Terms or engage in harmful conduct.",
        "You may also terminate your use of the Service at any time. Upon termination, your access will be revoked and your stored data may be deleted."
      ]
    },
    {
      id: "disclaimers",
      title: "6. Disclaimers",
      content: [
        "The Service is provided \"as-is\" and \"as available\" without warranties of any kind, express or implied, including but not limited to fitness for a particular purpose, merchantability, or non-infringement.",
        "We do not guarantee that the Service will always be secure, error-free, or available at all times."
      ]
    },
    {
      id: "liability",
      title: "7. Limitation of Liability",
      content: [
        "To the maximum extent permitted by law, ${companyName} and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or loss of data, revenue, or profits, resulting from your use of or inability to use the Service."
      ]
    },
    {
      id: "modifications",
      title: "8. Modifications to the Terms",
      content: [
        "We may revise these Terms at any time. You will be notified of any material changes and your continued use of the Service after such changes constitutes acceptance."
      ]
    },
    {
      id: "governing-law",
      title: "9. Governing Law",
      content: [
        `These Terms are governed by the laws of ${yourCountry}, without regard to conflict of law principles.`
      ]
    },
    {
      id: "contact",
      title: "📬 Contact",
      content: [
        "If you have questions about these Terms, please contact us:",
        `**Email:** ${supportEmail}`
      ]
    }
  ]
};

const Paragraph = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <p className="mb-3 leading-relaxed text-slate-300">
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index} className="font-semibold text-slate-100">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </p>
  );
};

export default function TermsOfServicePage() {
  const accentColor = "sky-500";
  return (
    <div className="min-h-screen bg-black text-slate-50 selection:bg-sky-700 selection:text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-950/70 border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-slate-100 hover:text-sky-400 transition-colors">
            {companyName}
          </Link>
          <Link href="/" >
            <Button variant="outline" className={`bg-transparent border-${accentColor} text-${accentColor} hover:bg-${accentColor} hover:text-slate-950 transition-all duration-300 ease-in-out`}>
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 md:py-16">
        <header className="mb-10 md:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-100 mb-3">
            {termsData.title}
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Effective Date: {termsData.effectiveDate}
          </p>
        </header>

        <div className="max-w-3xl mx-auto bg-slate-900 p-6 sm:p-8 md:p-10 rounded-lg shadow-2xl border border-slate-800">
          {termsData.introduction.map((text, idx) => (
            <Paragraph key={`intro-${idx}`} text={text} />
          ))}

          {termsData.sections.map((section) => (
            <section key={section.id} className="mt-8 pt-6 border-t border-slate-700 first-of-type:border-t-0 first-of-type:pt-0 first-of-type:mt-0">
              <h2 className={`text-2xl font-semibold text-${accentColor} mb-4`}>{section.title}</h2>
              {section.content?.map((text, idx) => (
                <Paragraph key={`content-${section.id}-${idx}`} text={text} />
              ))}
              {section.points && (
                <ul className="list-disc list-outside ml-5 space-y-1 text-slate-300">
                  {section.points.map((point, idx) => (
                    <li key={`point-${section.id}-${idx}`}><Paragraph text={point} /></li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>

      <footer className="py-8 bg-slate-950 border-t border-slate-800 mt-16">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <p className="mt-1">
            <Link href="/" className="hover:text-sky-400 transition-colors">Home</Link>
            <span className="mx-2">&bull;</span>
            <Link href="/privacy-policy" className="hover:text-sky-400 transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}