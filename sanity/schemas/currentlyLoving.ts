export default {
  name: 'currentlyLoving',
  title: 'Currently Loving',
  type: 'document',
  fields: [
    {
      name: 'songName',
      title: 'Song Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'artistName',
      title: 'Artist Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'albumName',
      title: 'Album Name',
      type: 'string',
      description: 'Used to fetch album cover automatically',
    },
    {
      name: 'albumCover',
      title: 'Album Cover (Optional)',
      type: 'image',
      description: 'Upload manually if auto-fetch fails',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'spotifyUrl',
      title: 'Spotify/YouTube Music URL (Optional)',
      type: 'url',
      description: 'Link to the song',
    },
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Only one should be active at a time',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'songName',
      subtitle: 'artistName',
      media: 'albumCover',
    },
  },
};
