export default {
  name: 'personalInfo',
  title: 'Personal Information',
  type: 'document',
  
  fields: [
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Professional Title',
      type: 'string',
      description: 'e.g., Software Engineer',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short subtitle for hero section',
      validation: (Rule: any) => Rule.max(100),
    },
    {
      name: 'shortBio',
      title: 'Short Bio',
      type: 'text',
      description: 'Used in hero section (2-3 sentences)',
      rows: 3,
      validation: (Rule: any) => Rule.max(300),
    },
    {
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    },
    {
      name: 'resume',
      title: 'Resume PDF',
      type: 'file',
      options: {
        accept: '.pdf',
      },
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g., Ahmedabad, India',
    },
    {
      name: 'social',
      title: 'Social Media',
      type: 'object',
      fields: [
        { name: 'github', title: 'GitHub Username', type: 'string' },
        { name: 'linkedin', title: 'LinkedIn Username', type: 'string' },
        { name: 'twitter', title: 'Twitter/X Handle', type: 'string' },
        { name: 'instagram', title: 'Instagram Handle', type: 'string' },
      ],
    },
    {
      name: 'stats',
      title: 'Statistics',
      type: 'object',
      fields: [
        {
          name: 'yearsExperience',
          title: 'Years of Experience',
          type: 'number',
          validation: (Rule: any) => Rule.required().positive(),
        },
        {
          name: 'projectsCompleted',
          title: 'Projects Completed',
          type: 'number',
          validation: (Rule: any) => Rule.required().positive(),
        },
        {
          name: 'usersImpacted',
          title: 'Users/Clients Impacted',
          type: 'number',
          validation: (Rule: any) => Rule.positive(),
        },
      ],
    },
  ],
  
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'profileImage',
    },
  },
};
