const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  qr: { type: String, required: true, unique: true },
  year: { type: String, required: true },
  tome: { type: String, required: true },
  tomeNumber: { type: Number, default: null },
  registryFrom: { type: String, required: true },
  registryTo: { type: String, required: true },
  status: { type: String, enum: ['En archivos','En uso'], default: 'En archivos' },
  notes: { type: String, default: '' },
  addedDate: { type: Date, default: Date.now },
  addedBy: { type: String, default: 'Sistema' },
  lastModified: { type: Date },
  modifiedBy: { type: String }
});

module.exports = mongoose.model('Book', BookSchema);
