import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6jmnha2k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function addBlogPost() {
  console.log('📝 Adding blog post to Sanity...\n');

  try {
    // Create Author first (if not exists)
    const author = await client.createIfNotExists({
      _type: 'author',
      _id: 'author-divya',
      name: 'Divya Panchori',
      slug: {
        _type: 'slug',
        current: 'divya-panchori',
      },
      role: 'Software Engineer',
    });
    console.log('✓ Author ready\n');

    // Create Blog Post
    const blogPost = await client.create({
      _type: 'blogPost',
      title: 'Building Config-Driven UIs: Lessons from Production',
      slug: {
        _type: 'slug',
        current: 'config-driven-ui-architecture',
      },
      author: {
        _type: 'reference',
        _ref: author._id,
      },
      publishedAt: new Date('2024-03-20T10:00:00Z').toISOString(),
      excerpt: 'How we reduced frontend development effort by 80% using a config-driven UI architecture with a custom Vite plugin at IQM Corporation.',
      body: [
        {
          _type: 'block',
          _key: 'block1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'In modern web applications, maintaining consistency while shipping features quickly is a constant challenge. At IQM Corporation, we tackled this by building a config-driven UI architecture that fundamentally changed how we develop frontend features.',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block2',
          style: 'h2',
          children: [
            {
              _type: 'span',
              _key: 'span2',
              text: 'The Problem',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block3',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span3',
              text: 'Building AdTech platforms like Planner, Bid Model, and Reporting required creating dozens of similar but slightly different UI components. Each new feature meant writing custom React components, duplicating logic, and increasing maintenance overhead.',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block4',
          style: 'h2',
          children: [
            {
              _type: 'span',
              _key: 'span4',
              text: 'The Solution: Config-Driven Architecture',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block5',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span5',
              text: 'Using a custom Vite plugin, we enabled dynamic component rendering from backend-driven configs. The backend sends JSON configurations that define UI structure, validation rules, and behavior. The frontend interprets these configs and renders appropriate components automatically.',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block6',
          style: 'h2',
          children: [
            {
              _type: 'span',
              _key: 'span6',
              text: 'Results',
              marks: [],
            },
          ],
        },
        {
          _type: 'block',
          _key: 'block7',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'span7',
              text: 'This approach reduced frontend development effort by approximately 80%. New features that previously took days now take hours. The system is more maintainable, consistent, and scalable across all our AdTech products.',
              marks: ['strong'],
            },
          ],
        },
      ],
      categories: ['System Design', 'Frontend Architecture', 'Web Development'],
      featured: true,
      readingTime: 5,
    });

    console.log('✅ Blog post created successfully!\n');
    console.log(`Title: ${blogPost.title}`);
    console.log(`ID: ${blogPost._id}`);
    console.log('\nYou can now view it at http://localhost:3004');
    
  } catch (error) {
    console.error('❌ Error adding blog post:', error);
    throw error;
  }
}

addBlogPost();
