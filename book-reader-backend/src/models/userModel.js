// userModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// User Schema following the recommended structure from the analysis
const UserSchema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  profile: {
    displayName: { type: String },
    avatarUrl: { type: String },
    preferences: {
      language: { type: String, default: 'en' },
      darkMode: { type: Boolean, default: false }
    }
  },
  googleTranslateApiKey: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to find user by username or email
UserSchema.statics.findByUsernameOrEmail = function(login) {
  return this.findOne({
    $or: [{ username: login }, { email: login }]
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;