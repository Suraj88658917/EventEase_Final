const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Music', 'Tech', 'Business', 'Other'],
      default: 'Other',
    },
    locationType: {
      type: String,
      enum: ['Online', 'In-Person'],
      default: 'In-Person',
    },
    location: {
      type: String,
      required: function () {
        return this.locationType === 'In-Person';
      },
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    eventId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
