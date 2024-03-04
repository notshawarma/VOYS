const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sentiment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
