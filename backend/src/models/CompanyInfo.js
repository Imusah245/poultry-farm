const mongoose = require('mongoose');

const companyInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: { type: String },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  founded: { type: Number },
  updatedAt: { type: Date, default: Date.now },
});

// Singleton pattern: get or create the single company info document
companyInfoSchema.statics.getOrCreate = async function (defaults = {}) {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create(defaults);
  }
  return doc;
};

// Override save to update the updatedAt timestamp
companyInfoSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Override findOneAndUpdate to update the updatedAt timestamp
companyInfoSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model('CompanyInfo', companyInfoSchema);
