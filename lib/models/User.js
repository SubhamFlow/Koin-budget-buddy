import mongoose from 'mongoose'

const modelName = 'User'

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, default: '' },
  image: { type: String, default: '' },
  provider: { type: String, enum: ['otp', 'google'], required: true },
}, {
  timestamps: true,
})

export default mongoose.models[modelName] || mongoose.model(modelName, UserSchema)