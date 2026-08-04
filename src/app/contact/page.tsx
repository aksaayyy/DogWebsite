import type { Metadata } from "next";
import ContactPageContent from "./PageContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Woof & Wag team. Reach out for general inquiries, partnership opportunities, or questions about our dog care content.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | Woof & Wag",
    description:
      "Get in touch with the Woof & Wag team. Reach out for general inquiries, partnership opportunities, or questions about our dog care content.",
  },
};

export default function ContactPage() {
  return <ContactPageContent />;
}
