const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  action: String,
  date: { type: Date, default: Date.now },
  bookId: String,
  bookDisplayName: String,
  user: String,
  notes: String
});

module.exports = mongoose.model('History', HistorySchema);
