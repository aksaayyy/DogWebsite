import type { NextConfig } from "next";

const SITE_URL = "https://www.woofnwagg.com";

// Deleted articles (duplicates/junk) -> surviving canonical article.
// Source of truth: article-forge/cache/redirect-map.json
const REDIRECT_MAP: Record<string, string> = {
  "best": "/",
  "canine": "/",
  "dog-gut-health": "/articles/dog-gut-microbiome-behavior-immunity-2026",
  "dog-food-allergies-symptoms-diagnosis-and-the-best-hypoallergenic-diets":
    "/articles/dog-food-allergies-in-dogs-symptoms-diagnosis-and-the-best-hypoallergenic-diets",
  "the-gut-health-revolution-how-your-dogs-microbiome-affects-e":
    "/articles/dog-gut-microbiome-behavior-immunity-2026",
  "separation-anxiety-in-dogs-the-evidence-based-treatment-guide":
    "/articles/separation-anxiety-in-dogs-evidence-based-treatment-guide",
  "elimination-diets-for-dogs-step-by-step-food-allergy-protocol-2026":
    "/articles/elimination-diets-for-dogs-step-by-step-allergy-protocol",
  "fresh-vs-dehydrated-dog-food-comparative-digestibility":
    "/articles/fresh-food-vs-dehydrated-dog-food-comparative-digestibility-and-cost-guide",
  "the-truth-about-grain-free-dog-food-what-research-says":
    "/articles/grain-free-dog-food-what-the-science-actually-says-in-2026",
  "best-raw-food-diets-for-dogs-complete-transition-and-safety-guide-2026":
    "/articles/best-raw-food-diets-for-dogs-complete-transition-and-safety-guide",
  "canine-weight-gain-diets-safely-helping-underweight-dogs":
    "/articles/canine-weight-gain-diets-how-to-safely-help-an-underweight-dog-gain-muscle",
  "exercise-automatic-habit-formation-neuroscience-2026":
    "/articles/canine-exercise-routine-habit-formation-2026",
  "barking-at-the-door-counter-conditioning-guide":
    "/articles/barking-at-the-door-evidence-based-counter-conditioning-guide-2026",
  "stop-dog-counter-surfing-positive-reinforcement-protocol":
    "/articles/dog-counter-surfing-how-to-stop-food-stealing-permanently-2026",
  "resource-guarding-in-dogs-desensitization-training":
    "/articles/overcoming-resource-guarding-in-dogs-positive-reinforcement-protocol-2026",
  "puppy-socialization-checklist-building-confidence":
    "/articles/puppy-socialization-checklist-the-critical-window-8-16-weeks-2026",
  "advanced-recall-for-high-distraction-environments":
    "/articles/recall-training-in-high-distraction-environments-advanced-field-protocol",
  "clicker-training-for-dogs-how-it-works-and-why-it-s-effective-2026":
    "/articles/clicker-training-for-beginners-the-science-of-learning",
  "reactive-dog-training-managing-leash-reactivity":
    "/articles/leash-reactivity-in-dogs-why-it-happens-and-how-to-fix-it-2026",
  "crate-training-without-stress-a-step-by-step-manual":
    "/articles/crate-training-for-dogs-the-complete-guide-2026",
  "understanding-dog-food-labels-how-to-identify-quality-ingredients":
    "/articles/how-to-read-a-dog-food-label-like-a-veterinary-nutritionist",
};

const redirects = [
  // Canonicalize bare domain to www (matches GSC property + canonical tags)
  {
    source: "/:path*",
    has: [{ type: "host" as const, value: "woofnwagg.com" }],
    destination: `${SITE_URL}/:path*`,
    permanent: true,
  },
  // Consolidate deleted duplicate articles into their keepers
  ...Object.entries(REDIRECT_MAP).map(([slug, destination]) => ({
    source: `/articles/${slug}`,
    destination,
    permanent: true,
  })),
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "*.apicdn.sanity.io" },
    ],
  },
  async redirects() {
    return redirects;
  },
};

export default nextConfig;
