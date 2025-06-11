import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    datetime: {
      type: String,
      default: () => new Date().toISOString(),
    },
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
