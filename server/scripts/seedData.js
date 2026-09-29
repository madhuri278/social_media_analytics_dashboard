const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Post = require('../models/Post');
const DailyAnalytics = require('../models/Analytics');
const { bootstrapAnalytics } = require('../controllers/analyticsController');

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/social_media_analytics';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();
    await DailyAnalytics.deleteMany();
    console.log('Cleared existing data.');

    // Create Demo User
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    const demoUser = await User.create({
      name: 'Demo Manager',
      email: 'demo@example.com',
      passwordHash,
      avatar: 'https://ui-avatars.com/api/?name=Demo+Manager&background=6366F1&color=fff&size=128'
    });
    console.log(`Demo User created: ${demoUser.email} (password: password123)`);

    // Bootstrap Analytics history (30 days)
    await bootstrapAnalytics(demoUser._id);
    console.log('Seeded 30-day historical daily analytics logs.');

    // Create Mock Posts
    const posts = [
      {
        userId: demoUser._id,
        content: '🚀 We are thrilled to launch Antigravity 2.0 today! Elevate your team workflows with next-generation agentic workflows. Check it out now! #Launch #Tech',
        platforms: ['twitter', 'linkedin'],
        status: 'published',
        metrics: { likes: 342, shares: 89, comments: 45 },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        userId: demoUser._id,
        content: 'What is your favorite design pattern when building event-driven microservices in Node.js? Let us know in the comments! 👇',
        platforms: ['linkedin'],
        status: 'published',
        metrics: { likes: 112, shares: 14, comments: 56 },
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        userId: demoUser._id,
        content: '🌅 Behind the scenes at our annual company hackathon. Innovation never sleeps! #LifeAtWork #Hackathon',
        platforms: ['instagram'],
        status: 'published',
        metrics: { likes: 521, shares: 12, comments: 28 },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        userId: demoUser._id,
        content: '💡 Friendly reminder: Write code that is easy to delete, not easy to extend. Keep it simple and maintainable! #ProgrammingTips',
        platforms: ['twitter'],
        status: 'published',
        metrics: { likes: 180, shares: 52, comments: 19 },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        userId: demoUser._id,
        content: '📅 Upcoming Webinar: Master Full-Stack Architecture with React & Mongoose on August 25th at 10 AM. Don\'t forget to register!',
        platforms: ['twitter', 'linkedin', 'instagram'],
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        metrics: { likes: 0, shares: 0, comments: 0 }
      },
      {
        userId: demoUser._id,
        content: '📝 Draft post regarding our next platform update details. Review dependencies and feature flags before publishing.',
        platforms: ['linkedin'],
        status: 'draft',
        metrics: { likes: 0, shares: 0, comments: 0 }
      }
    ];

    await Post.insertMany(posts);
    console.log('Seeded sample posts (published, scheduled, draft).');

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
