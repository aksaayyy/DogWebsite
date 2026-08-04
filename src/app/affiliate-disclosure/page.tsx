import type { Metadata } from "next";
import AffiliateDisclosurePageContent from "./PageContent";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "Read the Woof & Wag Affiliate Disclosure. Transparency about our affiliate relationships, advertising policies, and editorial independence.",
  alternates: { canonical: "/affiliate-disclosure" },
  openGraph: {
    title: "Affiliate Disclosure | Woof & Wag",
    description:
      "Read the Woof & Wag Affiliate Disclosure. Transparency about our affiliate relationships, advertising policies, and editorial independence.",
  },
};

export default function AffiliateDisclosurePage() {
  return <AffiliateDisclosurePageContent />;
}
