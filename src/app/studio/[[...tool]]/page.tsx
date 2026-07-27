import { Studio } from 'sanity';
import sanityConfig from '@/sanity/sanity.config';

export default function StudioPage() {
  return <Studio config={sanityConfig} />;
}
