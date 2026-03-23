import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'currentlyLoving',
  title: 'Currently Loving',
  type: 'document',
  fields: [
    defineField({
      name: 'songName',
      title: 'Song Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'artistName',
      title: 'Artist Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'albumName',
      title: 'Album Name',
      type: 'string',
      description: 'Used to fetch album cover automatically',
    }),
    defineField({
      name: 'albumCover',
      title: 'Album Cover (Optional)',
      type: 'image',
      description: 'Upload manually if auto-fetch fails',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify/YouTube Music URL (Optional)',
      type: 'url',
      description: 'Link to the song',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Only one should be active at a time',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'songName',
      subtitle: 'artistName',
      media: 'albumCover',
    },
  },
});
