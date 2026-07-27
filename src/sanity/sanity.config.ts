import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import post from './schemas/post';
import author from './schemas/author';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: 'woof-wag',
  title: 'Woof & Wag CMS',
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {
    types: [post, author],
  },
});
