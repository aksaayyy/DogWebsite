import type { Metadata } from "next";
import AboutPageContent from "./PageContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Woof & Wag — a digital pet media brand delivering research-backed, veterinarian-reviewed guides on dog nutrition, training, and wellness.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | Woof & Wag",
    description:
      "Learn about Woof & Wag — a digital pet media brand delivering research-backed, veterinarian-reviewed guides on dog nutrition, training, and wellness.",
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
