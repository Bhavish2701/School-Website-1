/**
 * User Mongoose Model
 * Role-Based Access Control and Secure Password Management
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/env');

const ROLES = [
  'SUPER_ADMIN',
  'PRINCIPAL',
  'VICE_PRINCIPAL',
  'OFFICE',
  'TEACHER',
  'STUDENT',
  'PARENT',
];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, 'Please provide a valid email'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password hash in queries by default
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: ROLES,
        message: '{VALUE} is not a valid role',
      },
      default: 'STUDENT',
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    // Student specific profile data
    studentProfile: {
      class: { type: String, trim: true },
      section: { type: String, trim: true },
      rollNumber: { type: String, trim: true },
      admissionNo: { type: String, trim: true },
      parentUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    // Parent specific: linked children user IDs
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Teacher specific: assigned classes and sections
    assignedClasses: [
      {
        class: { type: String, trim: true },
        section: { type: String, trim: true },
        subject: { type: String, trim: true },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plaintext password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    throw new Error('Password field not selected for comparison');
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate Short-lived Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      email: this.email,
      role: this.role,
      fullName: this.fullName,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expire,
    }
  );
};

// Generate Long-lived Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpire,
    }
  );
};

// Create Password Reset Token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to passwordResetToken field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiration (15 minutes from now)
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

// Clean object representation to ensure no secrets are exposed
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = { User, ROLES };
