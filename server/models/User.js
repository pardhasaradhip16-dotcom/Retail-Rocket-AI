import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  visitor_id: {
    type: String,
    default: '1000294',
    index: true,
  },
  role: {
    type: String,
    enum: ['shopper', 'judge', 'admin'],
    default: 'shopper',
  },
  avatar: {
    type: String,
    default: '',
  }
}, {
  timestamps: true
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;

