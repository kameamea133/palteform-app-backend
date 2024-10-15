const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['teacher', 'student', 'admin'],
    required: true
  },

  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

  isApproved: {
    type: Boolean,
    default: false  
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
