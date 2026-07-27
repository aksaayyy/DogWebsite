export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      initialValue: 'Veterinarian',
    },
    {
      name: 'avatarColor',
      title: 'Avatar Color Classes',
      type: 'string',
      initialValue: 'bg-amber-100 text-amber-800',
      description: 'Tailwind CSS classes for the avatar badge',
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
};
