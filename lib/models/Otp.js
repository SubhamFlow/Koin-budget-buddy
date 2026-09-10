import mongoose from 'mongoose'

const modelName = 'Otp';

if (process.env.NODE_ENV === 'development' && mongoose.models[modelName]) {
  delete mongoose.models[modelName];
}

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
})

OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 })

export default mongoose.models[modelName] || mongoose.model(modelName, OtpSchema)