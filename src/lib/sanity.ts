import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "x4mx0fr5";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const isSanityConfigured = !!(projectId && dataset);

// Initialize real client — always configured with fallback values
export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});

export interface Post {
  id: number | string;
  title: string;
  slug: { current: string };
  category: string;
  categoryColor: string;
  excerpt: string;
  body: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatarColor: string;
  };
}

export const fallbackPosts: Post[] = [
  {
    id: "1",
    title: "Understanding Your Dog's Silent Language",
    slug: { current: "understanding-your-dogs-silent-language" },
    category: "Health & Wellness",
    categoryColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
    excerpt: "Dogs communicate constantly through subtle body gestures. Learn to decode their ears, tail posture, and eyes to build a deeper bond.",
    body: "Dogs are highly communicative creatures, but the vast majority of their language is silent. To build a deep bond and prevent behavioral issues, pet owners must learn to read canine body postures. For instance, a wagging tail does not always translate to a happy dog. A stiff, rapid wag can signal high arousal, agitation, or warning, while a low, slow wag indicates uncertainty or hesitation. Ears are another critical indicator: ears pulled back flat against the head often show fear, stress, or submissive behavior, whereas ears facing forward show curiosity, confidence, or alert attention. Pay close attention to their eyes as well; 'whale eye' (where the white sclera is visible) is a clear sign that a dog feels threatened, anxious, or defensive. By learning to decode these signs, you can avoid common training pitfalls and ensure your dog feels safe and understood.",
    readTime: "5 min read",
    publishedAt: "2026-07-20",
    author: {
      name: "Dr. Sarah Jenkins",
      role: "Veterinarian",
      avatarColor: "bg-amber-100 text-amber-800"
    }
  },
  {
    id: "2",
    title: "Positive Reinforcement: The Modern Way",
    slug: { current: "positive-reinforcement-the-modern-way" },
    category: "Training & Behavior",
    categoryColor: "text-blue-700 bg-blue-50 border-blue-100",
    excerpt: "Move away from outdated dominance theories. Explore how reward-based training builds trust, speeds learning, and makes training fun.",
    body: "Positive reinforcement training is currently the gold standard in veterinary and behavioral science. Unlike outdated 'alpha dog' dominance theories that rely on physical correction or intimidation, positive reinforcement relies on rewarding desirable behaviors. By offering a high-value reward (like chicken, cheese, or play) within seconds of a correct action, the dog forms a positive association and will repeat that behavior. Punitive corrections can induce fear, raise stress hormone levels (cortisol), and ultimately lead to defensive aggression. When training, keep sessions short—typically between 5 and 10 minutes—to preserve your dog's focus. Always end on a successful repetition and a jackpot reward, ensuring they look forward to their next training session.",
    readTime: "8 min read",
    publishedAt: "2026-07-18",
    author: {
      name: "Marcus Vance",
      role: "Dog Behaviorist",
      avatarColor: "bg-blue-100 text-blue-800"
    }
  },
  {
    id: "3",
    title: "Decoding Dog Food Labels: What to Avoid",
    slug: { current: "decoding-dog-food-labels-what-to-avoid" },
    category: "Nutrition",
    categoryColor: "text-orange-700 bg-orange-50 border-orange-100",
    excerpt: "Is premium dog food worth the price? We break down common filler ingredients, preservatives, and what real nutritional balance looks like.",
    body: "Evaluating commercial dog food can be overwhelming, but decoding the labels is crucial for your pet's health. The Association of American Feed Control Officials (AAFCO) requires ingredients to be listed by pre-cooked weight, meaning the first three items constitute the majority of the food. Look for designated whole meats, such as 'deboned chicken' or 'lamb,' rather than generic categories like 'meat meal' or 'by-products.' It is wise to avoid artificial preservatives such as BHA, BHT, and ethoxyquin, which are synthetic compounds added to lengthen shelf life but have been linked to systemic health issues. Furthermore, watch out for high percentages of cheap fillers like corn gluten, wheat flour, and soy, which offer minimal nutritional benefit and can irritate your dog's digestive system. Investing in clean, high-protein nutrition now can prevent costly veterinary bills later in your dog's life.",
    readTime: "6 min read",
    publishedAt: "2026-07-15",
    author: {
      name: "Emma Sterling",
      role: "Pet Nutritionist",
      avatarColor: "bg-rose-100 text-rose-800"
    }
  }
];

export async function getPosts(): Promise<Post[]> {
  if (client) {
    try {
      const query = `*[_type == "post"] {
        "id": _id,
        title,
        slug,
        category,
        categoryColor,
        excerpt,
        body,
        readTime,
        publishedAt,
        author->{
          name,
          role,
          avatarColor
        }
      }`;
      const posts = await client.fetch(query);
      if (posts && posts.length > 0) {
        return posts;
      }
    } catch (error) {
      console.warn("Sanity fetch failed, falling back to local mock data:", error);
    }
  }
  
  return fallbackPosts;
}
