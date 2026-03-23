import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'recentlyWatched',
  title: 'Recently Watched',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Movie', value: 'movie' },
          { title: 'TV Show', value: 'show' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'Release year',
    }),
    defineField({
      name: 'rating',
      title: 'Your Rating',
      type: 'number',
      description: 'Rate out of 5',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'poster',
      title: 'Poster Image',
      type: 'image',
      description: 'Movie/Show poster',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'genre',
      title: 'Genre',
      type: 'string',
      description: 'e.g., Action, Drama, Comedy',
    }),
    defineField({
      name: 'thoughts',
      title: 'Quick Thoughts (Optional)',
      type: 'text',
      rows: 2,
      description: 'Brief review or comment',
    }),
    defineField({
      name: 'watchedDate',
      title: 'Watched Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Show on Currently section',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      media: 'poster',
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        ...selection,
        subtitle: `${subtitle === 'movie' ? 'Movie' : 'TV Show'}`,
      };
    },
  },
});
