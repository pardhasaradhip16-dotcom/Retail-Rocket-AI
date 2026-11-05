import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  visitor_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  total_views: {
    type: Number,
    default: 0,
  },
  total_add_to_cart: {
    type: Number,
    default: 0,
  },
  total_transactions: {
    type: Number,
    default: 0,
  },
  interaction_score: {
    type: Number,
    default: 0,
  },
  last_active: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

export const Visitor = mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
export default Visitor;

