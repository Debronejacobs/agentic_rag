// app/privacy-policy/page.tsx
// or pages/privacy-policy.tsx
"use client";


import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Optional, for consistency

// --- BEGIN PRIVACY POLICY CONTENT ---
// 📝 Edit the content below to update your Privacy Policy.
// Replace all placeholders like [Your Company Name], [Insert Date], etc.

const companyName = "TuriqAI"; // Define once, use multiple times
const supportEmail = "turiqai@gmail.com";
const effectiveDate = "2025";
const companyAddress = "[Business Address or \"Remote-Based\"]";
const yourCountry = "Kenya"; // Country where your business is primarily based or where data is processed
const llmProviderName = "Gemini / openrouter"; // e.g., "OpenAI's GPT models"
const whatsAppApiTool = "API tool like WPPConnect or Meta's Official API"; 

const policyData = {
  title: "Privacy Policy",
  effectiveDate: effectiveDate,
  introduction: [
    `${companyName} (“we”, “our”, or “us”) provides a platform that allows businesses to connect a WhatsApp number to an AI assistant, upload business data, and manage AI-driven customer interactions.`,
    `We are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your data.`
  ],
  sections: [
    {
      id: "info-collect",
      title: "1. Information We Collect",
      subsections: [
        {
          heading: "a. User Information",
          points: [
            "Google account details (name, email) used for sign-in.",
            "Business name and contact info.",
          ],
        },
        {
          heading: "b. WhatsApp Account Data",
          points: [
            "QR code connection metadata (no credentials are stored).",
            "Phone number (for identification only).",
            "Messages exchanged via WhatsApp (used for displaying conversations and AI responses).",
          ],
        },
        {
          heading: "c. Uploaded Business Data",
          points: [
            `Text, documents, or content uploaded to train the AI (stored securely and used solely for your business' AI assistant).`,
          ],
        },
        {
          heading: "d. Usage Data",
          points: [
            "Timestamps, API usage logs, and platform activity (for improving service quality and abuse prevention).",
          ],
        },
      ],
    },
    {
      id: "info-use",
      title: "2. How We Use Your Information",
      content: [
        "To provide, maintain, and improve our AI assistant services.",
        "To connect your WhatsApp account securely.",
        "To train and personalize the AI based on your business data.",
        "To offer customer support and respond to inquiries.",
        "To analyze usage patterns for performance and security.",
      ],
      notice: `We **do not** use your data to train any public or shared models. Your data belongs **only to you**.`,
    },
    {
      id: "data-security",
      title: "3. Data Security",
      content: ["We implement industry-standard security measures including:"],
      points: [
        "End-to-end encryption (for WhatsApp messages where applicable, based on WhatsApp's own E2EE for business messages).",
        "Secure token-based authentication (Google Sign-In).",
        "Isolated storage for uploaded content with strict access controls.",
        "Role-based access control within our platform.",
        "HTTPS enforced on all endpoints to protect data in transit.",
      ],
      notice: `We **do not store** your WhatsApp credentials or QR code sessions after the initial connection is established.`,
    },
    {
      id: "data-retention",
      title: "4. Data Retention",
      content: [
        `We retain your data as long as your account is active or as needed to provide you the service. You can request deletion of your account and associated data at any time by contacting us at ${supportEmail}.`,
      ],
    },
    {
      id: "third-party",
      title: "5. Third-Party Services",
      content: ["We use the following third-party services:"],
      points: [
        `**Google Sign-In** – for secure authentication. Their privacy policy can be found on Google's website.`,
        `**${llmProviderName}** – to generate AI responses. We ensure our agreement with them upholds data privacy standards for the data processed.`,
        `**WhatsApp via ${whatsAppApiTool}** – for real-time messaging. Your use of WhatsApp is also subject to WhatsApp's own Privacy Policy.`,
      ],
      notice: `We ensure that these services comply with strict data privacy regulations and are selected based on their commitment to security and privacy.`,
    },
    {
      id: "your-rights",
      title: "6. Your Rights",
      content: ["You have the right to:"],
      points: [
        "Access your stored data.",
        "Request corrections to inaccurate or incomplete data.",
        "Request deletion of your personal data, subject to certain legal limitations.",
        "Withdraw consent for data processing at any time (this may affect your ability to use our services).",
        "Export your uploaded business data in a common format.",
      ],
      notice: `Contact us at ${supportEmail} to make any requests.`,
    },
    {
      id: "international-users",
      title: "7. International Users",
      content: [
        `If you are accessing our service from outside ${yourCountry}, please be aware that your information may be transferred to, stored, and processed in ${yourCountry} or other jurisdictions where our servers or third-party service providers are located. Data protection laws in these jurisdictions may differ from those in your country of residence. By using our services, you consent to such transfers.`,
      ],
    },
    {
      id: "policy-changes",
      title: "8. Changes to This Policy",
      content: [
        `We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. You will be notified of any significant changes via email or through in-app notifications before the changes take effect. We encourage you to review this policy periodically.`,
      ],
    },
    {
      id: "contact",
      title: "📬 Contact",
      content: [
        "For questions, concerns, or complaints regarding this Privacy Policy or our data practices, please reach us at:",
        `**Email:** ${supportEmail}`,
        `**Address:** ${companyAddress}`,
      ],
    },
  ],
};

// --- END PRIVACY POLICY CONTENT ---


// Helper component to render paragraphs with bold text handling
const Paragraph = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g); // Split by **bolded text**
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


export default function PrivacyPolicyPage() {
  // Accent color for consistency with the landing page, adjust if needed
  const accentColor = "sky-500";

  return (
    <div className="min-h-screen bg-black text-slate-50 selection:bg-sky-700 selection:text-white">
      {/* Simplified Navigation for policy page */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-950/70 border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-slate-100 hover:text-sky-400 transition-colors">
            {companyName}
          </Link>
          <Link href="/#faq" legacyBehavior>
             {/* You might want a "Back to Home" or specific CTA here */}
            <Button
              variant="outline"
              className={`bg-transparent border-${accentColor} text-${accentColor} hover:bg-${accentColor} hover:text-slate-950 transition-all duration-300 ease-in-out`}
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Policy Content */}
      <main className="container mx-auto px-6 py-12 md:py-16">
        <header className="mb-10 md:mb-12 text-center">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-100 mb-3`}>
            {policyData.title}
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Effective Date: {policyData.effectiveDate}
          </p>
        </header>

        <div className="max-w-3xl mx-auto bg-slate-900 p-6 sm:p-8 md:p-10 rounded-lg shadow-2xl border border-slate-800">
          {policyData.introduction.map((paragraph, index) => (
            <Paragraph key={`intro-${index}`} text={paragraph} />
          ))}

          {policyData.sections.map((section) => (
            <section key={section.id} className="mt-8 pt-6 border-t border-slate-700 first-of-type:border-t-0 first-of-type:pt-0 first-of-type:mt-0">
              <h2 className={`text-2xl font-semibold text-${accentColor} mb-4`}>
                {section.title}
              </h2>
              {section.content && Array.isArray(section.content) && section.content.map((paragraph, index) => (
                <Paragraph key={`content-${section.id}-${index}`} text={paragraph} />
              ))}
              {section.subsections && section.subsections.map(subsection => (
                <div key={subsection.heading} className="mt-4 mb-2">
                  {subsection.heading && <h3 className="text-lg font-semibold text-slate-200 mb-2">{subsection.heading}</h3>}
                  {subsection.points && (
                    <ul className="list-disc list-outside ml-5 space-y-1 text-slate-300">
                      {subsection.points.map((point, pIndex) => (
                        <li key={`point-${section.id}-${subsection.heading}-${pIndex}`}>
                          <Paragraph text={point} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
               {section.points && !section.subsections && ( // For sections that have direct points without subsections
                <ul className="list-disc list-outside ml-5 space-y-1 text-slate-300">
                  {section.points.map((point, pIndex) => (
                     <li key={`direct-point-${section.id}-${pIndex}`}>
                        <Paragraph text={point} />
                     </li>
                  ))}
                </ul>
              )}
              {section.notice && (
                <div className="mt-4 p-4 bg-slate-800 border-l-4 border-sky-600 rounded-r-md">
                  <Paragraph text={section.notice} />
                </div>
              )}
            </section>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-800 mt-16">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <p className="mt-1">
            <Link href="/" className="hover:text-sky-400 transition-colors">Home</Link>
            <span className="mx-2">&bull;</span>
            <Link href="/terms-of-service" className="hover:text-sky-400 transition-colors">Terms of Service</Link> {/* Add this if you have one */}
          </p>
        </div>
      </footer>
    </div>
  );
}