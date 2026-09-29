const DailyAnalytics = require('../models/Analytics');
const Post = require('../models/Post');

// Helper to format date as YYYY-MM-DD
const formatDate = (date) => date.toISOString().split('T')[0];

// Generates 30 days of historical data for seeding or on-the-fly bootstrapping
const bootstrapAnalytics = async (userId) => {
  const data = [];
  const now = new Date();
  
  // Starting values
  let followers = 12500;
  let reach = 45000;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    date.setHours(0, 0, 0, 0);

    // Random walk with upward trend
    followers += Math.floor(Math.random() * 80) - 20;
    reach += Math.floor(Math.random() * 400) - 100;
    const engagementRate = parseFloat((3.0 + Math.random() * 3.5).toFixed(2));
    const postsCount = Math.floor(Math.random() * 3); // 0 to 2 posts per day

    const twFollowers = Math.floor(followers * 0.4);
    const liFollowers = Math.floor(followers * 0.35);
    const igFollowers = followers - twFollowers - liFollowers;

    data.push({
      userId,
      date,
      followersCount: followers,
      engagementRate,
      reach,
      postsCount,
      platformMetrics: {
        twitter: { followers: twFollowers, engagement: parseFloat((engagementRate * 0.8).toFixed(2)) },
        linkedin: { followers: liFollowers, engagement: parseFloat((engagementRate * 1.1).toFixed(2)) },
        instagram: { followers: igFollowers, engagement: parseFloat((engagementRate * 1.3).toFixed(2)) }
      }
    });
  }

  // Clear existing and insert
  await DailyAnalytics.deleteMany({ userId });
  await DailyAnalytics.insertMany(data);
  return data;
};

// @desc    Get dashboard metrics overview
// @route   GET /api/analytics/overview
// @access  Private
const getOverview = async (req, res, next) => {
  try {
    let stats = await DailyAnalytics.find({ userId: req.user._id }).sort({ date: 1 });
    
    // Auto-bootstrap if empty
    if (stats.length === 0) {
      stats = await bootstrapAnalytics(req.user._id);
      stats.sort((a, b) => a.date - b.date);
    }

    const latest = stats[stats.length - 1];
    
    // Find comparative data (e.g., 7 days ago or the oldest available if < 7)
    const compareIndex = stats.length > 7 ? stats.length - 8 : 0;
    const past = stats[compareIndex];

    // Count total posts in system
    const totalPostsCount = await Post.countDocuments({ userId: req.user._id });
    const publishedPostsCount = await Post.countDocuments({ userId: req.user._id, status: 'published' });

    // Calculate percentage changes
    const followersChange = past.followersCount > 0 
      ? parseFloat((((latest.followersCount - past.followersCount) / past.followersCount) * 100).toFixed(1))
      : 0;

    const engagementChange = past.engagementRate > 0
      ? parseFloat((((latest.engagementRate - past.engagementRate) / past.engagementRate) * 100).toFixed(1))
      : 0;

    const reachChange = past.reach > 0
      ? parseFloat((((latest.reach - past.reach) / past.reach) * 100).toFixed(1))
      : 0;

    res.json({
      metrics: {
        totalFollowers: {
          value: latest.followersCount,
          change: followersChange,
          isPositive: followersChange >= 0
        },
        engagementRate: {
          value: latest.engagementRate,
          change: engagementChange,
          isPositive: engagementChange >= 0
        },
        reach: {
          value: latest.reach,
          change: reachChange,
          isPositive: reachChange >= 0
        },
        totalPosts: {
          value: totalPostsCount,
          published: publishedPostsCount,
          change: 8.5, // Mock static trend comparison
          isPositive: true
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard charts metrics
// @route   GET /api/analytics/charts
// @access  Private
const getChartsData = async (req, res, next) => {
  try {
    let stats = await DailyAnalytics.find({ userId: req.user._id }).sort({ date: 1 });

    if (stats.length === 0) {
      stats = await bootstrapAnalytics(req.user._id);
      stats.sort((a, b) => a.date - b.date);
    }

    // 1. Follower Growth Trend (formatted for chart)
    const followerGrowth = stats.map(s => ({
      date: formatDate(s.date),
      Total: s.followersCount,
      Twitter: s.platformMetrics.twitter.followers,
      LinkedIn: s.platformMetrics.linkedin.followers,
      Instagram: s.platformMetrics.instagram.followers,
    }));

    // 2. Engagement rates by platform
    const latest = stats[stats.length - 1];
    const engagementByPlatform = [
      { name: 'Twitter/X', engagement: latest.platformMetrics.twitter.engagement },
      { name: 'LinkedIn', engagement: latest.platformMetrics.linkedin.engagement },
      { name: 'Instagram', engagement: latest.platformMetrics.instagram.engagement }
    ];

    // 3. Engagement by Post Type (Video, Image, Carousel, Link, Text)
    // We can calculate this from published posts or provide high-quality representation
    const engagementByPostType = [
      { type: 'Video', engagement: 6.8 },
      { type: 'Image', engagement: 4.2 },
      { type: 'Carousel', engagement: 5.5 },
      { type: 'Link', engagement: 2.1 },
      { type: 'Text', engagement: 1.8 }
    ];

    res.json({
      followerGrowth,
      engagementByPlatform,
      engagementByPostType,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getChartsData,
  bootstrapAnalytics,
};
