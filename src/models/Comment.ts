import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * TypeScript interface for the Comment model.
 * Represents a comment associated with a post, including its content,
 * the author, the related post, and an array of user IDs that liked the comment.
 */
export interface IComment extends Document {
  content: string; // The comment text
  author: mongoose.Types.ObjectId; // Reference to the user who authored the comment
  postId: mongoose.Types.ObjectId; // Reference to the associated post
  likes: mongoose.Types.ObjectId[]; // Array of user IDs who liked the comment
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for the Comment model.
 */
const CommentSchema: Schema<IComment> = new Schema<IComment>(
  {
    // The content of the comment. It is required with a minimum of 1 character and a maximum of 1000 characters.
    content: {
      type: String,
      required: [true, 'Comment content is required.'],
      minlength: [1, 'Comment cannot be empty.'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters.'],
      trim: true, // Removes leading and trailing whitespace
    },
    // The author field references the User model. It is required.
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment author is required.'],
    },
    // The post field references the Post model. It is required.
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Associated post is required.'],
    },
    // The likes field stores an array of user IDs (references to the User model) who liked this comment.
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

/**
 * Mongoose model for the Comment.
 */
export const Comment: Model<IComment> = mongoose.model<IComment>('Comment', CommentSchema);
