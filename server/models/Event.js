import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  timestamp: {
    type: Number,
    required: true,
    index: true,
  },
  visitor_id: {
    type: String,
    required: true,
    index: true,
  },
  event: {
    type: String,
    required: true,
    enum: ['view', 'addtocart', 'transaction'],
    index: true,
  },
  item_id: {
    type: String,
    required: true,
    index: true,
  },
  transaction_id: {
    type: String,
    default: '',
  }
}, {
  timestamps: true
});

export const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
export default Event;

