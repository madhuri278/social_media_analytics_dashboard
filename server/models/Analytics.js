const mongoose = require('mongoose');

const dailyAnalyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    engagementRate: {
      type: Number, // Percentage (e.g. 4.2)
      default: 0,
    },
    reach: {
      type: Number,
      default: 0,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    // Breakdowns for the follower count/growth graph
    platformMetrics: {
      twitter: { followers: { type: Number, default: 0 }, engagement: { type: Number, default: 0 } },
      linkedin: { followers: { type: Number, default: 0 }, engagement: { type: Number, default: 0 } },
      instagram: { followers: { type: Number, default: 0 }, engagement: { type: Number, default: 0 } },
    },
  },
  {
    timestamps: true,
  }
);

// Unique index for userId and date combinations to avoid duplicate entries for the same day
dailyAnalyticsSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyAnalytics', dailyAnalyticsSchema);
