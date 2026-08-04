import type { Metadata } from "next";
import TermsPageContent from "./PageContent";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the Woof & Wag Terms of Service. Understand the rules and guidelines governing your use of our dog care blog and community platform.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service | Woof & Wag",
    description:
      "Review the Woof & Wag Terms of Service. Understand the rules and guidelines governing your use of our dog care blog and community platform.",
  },
};

export default function TermsPage() {
  return <TermsPageContent />;
}
