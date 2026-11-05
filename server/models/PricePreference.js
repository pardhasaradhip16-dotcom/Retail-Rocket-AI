import mongoose from 'mongoose';

const PricePreferenceSchema = new mongoose.Schema({
  visitor_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  min_price: {
    type: Number,
    required: true,
  },
  max_price: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true
});

export const PricePreference = mongoose.models.PricePreference || mongoose.model('PricePreference', PricePreferenceSchema);
export default PricePreference;

