const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Post content cannot be empty'],
      trim: true,
    },
    platforms: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'A post must be scheduled or published on at least one platform.',
      },
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published'],
      default: 'draft',
    },
    metrics: {
      likes: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
