import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true,
    length: 6
  },
  purpose: {
    type: String,
    enum: ['signup', 'login', 'password-reset'],
    default: 'signup'
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // Auto-delete expired documents
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
otpSchema.index({ phone: 1, purpose: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to check if OTP is valid
otpSchema.methods.isValid = function() {
  return !this.isUsed && this.attempts < 3 && new Date() < this.expiresAt;
};

// Method to mark OTP as used
otpSchema.methods.markAsUsed = function() {
  this.isUsed = true;
  return this.save();
};

// Method to increment attempts
otpSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  return this.save();
};

// Static method to generate OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Static method to create OTP for phone
otpSchema.statics.createOTP = async function(phone, purpose = 'signup') {
  // Delete any existing OTP for this phone and purpose
  await this.deleteMany({ phone, purpose });
  
  const otp = this.generateOTP();
  const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRE) || 300000); // 5 minutes
  
  return await this.create({
    phone,
    otp,
    purpose,
    expiresAt
  });
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function(phone, otp, purpose = 'signup') {
  const otpDoc = await this.findOne({ phone, purpose }).sort({ createdAt: -1 });
  
  if (!otpDoc) {
    throw new Error('OTP not found');
  }
  
  if (!otpDoc.isValid()) {
    if (otpDoc.attempts >= 3) {
      throw new Error('OTP attempts exceeded');
    }
    if (new Date() >= otpDoc.expiresAt) {
      throw new Error('OTP expired');
    }
    if (otpDoc.isUsed) {
      throw new Error('OTP already used');
    }
  }
  
  if (otpDoc.otp !== otp) {
    await otpDoc.incrementAttempts();
    throw new Error('Invalid OTP');
  }
  
  await otpDoc.markAsUsed();
  return true;
};

const OTP = mongoose.model('OTP', otpSchema);

export default OTP; 