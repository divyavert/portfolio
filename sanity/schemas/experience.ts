export default {
  name: 'experience',
  title: 'Experience',
  type: 'document',
  
  fields: [
    {
      name: 'company',
      title: 'Company/Organization',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'companyUrl',
      title: 'Company Website',
      type: 'url',
    },
    {
      name: 'companyLogo',
      title: 'Company Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'role',
      title: 'Role/Position',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'type',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'full-time' },
          { title: 'Internship', value: 'internship' },
          { title: 'Freelance', value: 'freelance' },
          { title: 'Contract', value: 'contract' },
          { title: 'Education', value: 'education' },
        ],
      },
      initialValue: 'full-time',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g., Ahmedabad, India',
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      description: 'Leave empty if current',
    },
    {
      name: 'isCurrent',
      title: 'Current Position',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'description',
      title: 'Role Description',
      type: 'text',
      rows: 3,
      description: 'Brief overview of the role',
    },
    {
      name: 'achievements',
      title: 'Key Achievements',
      type: 'array',
      of: [{ type: 'text' }],
      description: 'Bullet points of accomplishments',
    },
    {
      name: 'techStack',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower = earlier in timeline',
      validation: (Rule: any) => Rule.integer().positive(),
    },
    {
      name: 'trailPosition',
      title: 'Trail Position',
      type: 'string',
      options: {
        list: [
          { title: 'Base Camp (Start)', value: 'basecamp' },
          { title: 'Mid Trail', value: 'midpoint' },
          { title: 'Summit (Current)', value: 'summit' },
        ],
      },
      description: 'Position on mountain trek trail',
    },
  ],
  
  preview: {
    select: {
      title: 'role',
      subtitle: 'company',
      media: 'companyLogo',
    },
  },
  
  orderings: [
    {
      title: 'Date (Newest First)',
      name: 'dateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
};
