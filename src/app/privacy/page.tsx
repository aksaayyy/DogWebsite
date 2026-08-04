import type { Metadata } from "next";
import PrivacyPageContent from "./PageContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Woof & Wag Privacy Policy. Learn how we collect, use, and safeguard your personal information when you visit our website.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | Woof & Wag",
    description:
      "Read the Woof & Wag Privacy Policy. Learn how we collect, use, and safeguard your personal information when you visit our website.",
  },
};

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
