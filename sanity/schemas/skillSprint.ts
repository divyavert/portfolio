// Schema for currently learning/skill sprint
export default {
  name: 'skillSprint',
  title: 'Skill Sprint',
  type: 'document',
  fields: [
    {
      name: 'courseName',
      title: 'Course Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'progress',
      title: 'Progress Percentage',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0).max(100),
      description: 'Progress percentage (0-100)',
    },
    {
      name: 'upNextLesson',
      title: 'Up Next Lesson',
      type: 'string',
      description: 'Next lesson or topic to learn',
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Emoji or icon identifier (e.g., ⚡, 🔥, 💡)',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Only one skill sprint should be active at a time',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'courseName',
      progress: 'progress',
      active: 'active',
    },
    prepare(selection: any) {
      const { title, progress, active } = selection;
      return {
        title: title,
        subtitle: `${progress}% complete${active ? ' (Active)' : ''}`,
      };
    },
  },
};
