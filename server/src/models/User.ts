import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'inactive';

export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
      unique: true,
      index: true,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'editor', 'viewer'],
        message: '{VALUE} is not a valid role',
      },
      default: 'viewer',
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true; // optional
          const digitsOnly = v.replace(/\D/g, '');
          const pattern = /^[0-9+\s\-()]+$/;
          return pattern.test(v) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
        },
        message: 'Phone number must contain between 7 and 15 digits',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
