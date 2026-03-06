const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Record title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Lab Report', 'Prescription', 'X-Ray', 'Scan', 'Other'],
      default: 'Other',
    },
    fileName: {
      type: String,
      default: '',
    },
    filePath: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Record', recordSchema);
