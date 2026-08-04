import type { Metadata } from "next";
import EditorialPolicyPageContent from "./PageContent";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description:
    "Discover the Woof & Wag editorial standards. Learn how we ensure accuracy, transparency, and evidence-based research in every dog care article we publish.",
  alternates: { canonical: "/editorial-policy" },
  openGraph: {
    title: "Editorial Policy | Woof & Wag",
    description:
      "Discover the Woof & Wag editorial standards. Learn how we ensure accuracy, transparency, and evidence-based research in every dog care article we publish.",
  },
};

export default function EditorialPolicyPage() {
  return <EditorialPolicyPageContent />;
}
