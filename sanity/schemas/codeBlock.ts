export default {
  name: 'code',
  title: 'Code Block',
  type: 'object',
  fields: [
    {
      name: 'filename',
      title: 'Filename',
      type: 'string',
    },
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      initialValue: 'tsx',
      options: {
        list: [
          { title: 'TypeScript', value: 'ts' },
          { title: 'TSX', value: 'tsx' },
          { title: 'JavaScript', value: 'js' },
          { title: 'JSX', value: 'jsx' },
          { title: 'JSON', value: 'json' },
          { title: 'CSS', value: 'css' },
          { title: 'HTML', value: 'html' },
          { title: 'Bash', value: 'bash' },
          { title: 'Go', value: 'go' },
          { title: 'Java', value: 'java' },
          { title: 'Python', value: 'python' },
          { title: 'SQL', value: 'sql' },
          { title: 'YAML', value: 'yaml' },
          { title: 'Markdown', value: 'markdown' },
        ],
      },
    },
    {
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 14,
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'filename',
      subtitle: 'language',
      code: 'code',
    },
    prepare(selection: any) {
      return {
        title: selection.title || 'Code block',
        subtitle: selection.subtitle || 'plain text',
        media: undefined,
      };
    },
  },
};
