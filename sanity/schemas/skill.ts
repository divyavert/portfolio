export default {
  name: 'skill',
  title: 'Skills',
  type: 'document',
  
  fields: [
    {
      name: 'name',
      title: 'Skill Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Languages', value: 'languages' },
          { title: 'Frontend', value: 'frontend' },
          { title: 'Backend', value: 'backend' },
          { title: 'Tools & Infrastructure', value: 'tools' },
          { title: 'Concepts', value: 'concepts' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'proficiency',
      title: 'Proficiency Level',
      type: 'number',
      description: '0-100 (optional, for progress bars)',
      validation: (Rule: any) => Rule.min(0).max(100),
    },
    {
      name: 'icon',
      title: 'Icon/Logo',
      type: 'image',
      description: 'Technology logo (optional)',
    },
    {
      name: 'color',
      title: 'Brand Color',
      type: 'string',
      description: 'Hex color for skill badge',
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on homepage',
      initialValue: true,
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order within category',
    },
  ],
  
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'icon',
    },
  },
  
  orderings: [
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
};
