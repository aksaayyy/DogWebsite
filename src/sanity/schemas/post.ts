export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Nutrition', value: 'Nutrition' },
          { title: 'Training & Behavior', value: 'Training & Behavior' },
          { title: 'Health & Wellness', value: 'Health & Wellness' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'categoryColor',
      title: 'Category Color Classes',
      type: 'string',
      description: 'Tailwind CSS classes for the category badge',
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Body (HTML)',
      type: 'text',
      rows: 20,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'readTime',
      title: 'Read Time',
      type: 'string',
      initialValue: '8 min read',
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Optional override for <title> tag',
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      description: 'Optional override for meta description',
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    },
  ],
  initialValue: {
    publishedAt: () => new Date().toISOString().split('T')[0],
  },
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'author' },
    prepare(selection: any) {
      return { ...selection, subtitle: selection.subtitle || 'Uncategorized' };
    },
  },
  orderings: [
    {
      title: 'Published Date (newest first)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
};
