const mongoose = require('mongoose');

const vacationSchema = mongoose.Schema({ // The Schema for our mongoose model
  name: String,
  slug: String,
  category: String,
  sku: String, // Stock Keeping Unit (SKU)
  description: String,
  location: {
    search: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  price: Number,
  tags: [String],
  inSeason: Boolean,
  available: Boolean,
  requiresWaiver: Boolean,
  maximumGuests: Number,
  notes: String,
  packagesSold: Number
});

const Vacation = mongoose.model('Vacation', vacationSchema); // The actual model

module.exports = Vacation;
