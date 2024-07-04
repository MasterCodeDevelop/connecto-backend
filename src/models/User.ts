import mongoose, { Schema, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// TypeScript interface for a user
interface IUser extends Document {
  email: string;
  password: string;
  isAdmin: boolean;
  name: string;
  familyName: string;
  profilePicture?: string;
}

// Data schema definition
const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic regex for email validation
        'Please enter a valid email address.',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password should be at least 8 characters long.'],
      // Add password complexity validation if necessary
    },
    isAdmin: {
      type: Boolean,
      default: false, // Default value for non-admin users
    },
    name: {
      type: String,
      required: [true, 'First name is required.'],
      match: [/^[A-Za-zÀ-ÿ\s]+$/, 'First name can only contain letters and spaces.'], // Allow spaces
    },
    familyName: {
      type: String,
      required: [true, 'Last name is required.'],
      match: [/^[A-Za-zÀ-ÿ\s]+$/, 'Last name can only contain letters and spaces.'], // Allow spaces
    },
    profilePicture: {
      type: String,
      default: 'avatar.png',
      trim: true,
      match: [
        /^[\w,\s-]+\.(png|jpg|jpeg|gif|webp|svg)$/i,
        'Profile picture must be a valid image filename.',
      ],
    },
  },
  { timestamps: true }, // Automatically manage createdAt and updatedAt fields
);

// Add the uniqueValidator plugin for email uniqueness validation
userSchema.plugin(uniqueValidator, {
  message: 'This email is already in use.',
});

// Export the model
export default mongoose.model<IUser>('User', userSchema);
