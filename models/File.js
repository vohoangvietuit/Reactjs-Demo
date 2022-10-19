const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const FileSchema = new Schema({
  path: { type: String },
  caption: { type: String }
});

module.exports = File = mongoose.model('file', FileSchema);
