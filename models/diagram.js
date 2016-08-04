var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// описание схемы вводимых данных 
var schema = new Schema({
  html: {
    type: String,
    required: false
  },
  css: {
    type: String,
    required: false
  },
  js: {
    type: String,
    required: false
  },
  git: {
    type: String,
    required: false
  },
  gulp: {
    type: String,
    required: false
  },
  bower: {
    type: String,
    required: false
  },
  php: {
    type: String,
    required: false
  },
  nodejs: {
    type: String,
    required: false
  },
  mongodb: {
    type: String,
    required: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});


exports.Diagram = mongoose.model('Diagram', schema);