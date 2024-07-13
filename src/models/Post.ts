import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface representing a Post document in MongoDB.
 *
 * @interface IPost
 * @property {string} content - The content of the post.
 * @property {mongoose.Types.ObjectId} author - The ObjectId of the post's author.
 * @property {string} [file] - An optional file associated with the post.
 * @property {mongoose.Types.ObjectId[]} likes - Array of ObjectIds representing users who liked the post.
 * @property {mongoose.Types.ObjectId[]} comments - Array of ObjectIds representing comments on the post.
 * @property {Date} createdAt - Timestamp indicating when the post was created.
 * @property {Date} updatedAt - Timestamp indicating when the post was last updated.
 */
export interface IPost extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  file?: string;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for the Post model.
 * Defines the structure of the Post documents in MongoDB.
 */
const PostSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    file: {
      type: String,
      default: '',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Mongoose model for interacting with the Post collection.
 *
 * @constant Post
 * @type {Model<IPost>}
 */
const Post: Model<IPost> = mongoose.model<IPost>('Post', PostSchema);

export default Post;
