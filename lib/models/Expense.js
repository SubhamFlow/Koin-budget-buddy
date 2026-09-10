import mongoose from "mongoose";

const modelName = 'Expense';

if (process.env.NODE_ENV === 'development' && mongoose.models[modelName]) {
  delete mongoose.models[modelName];
}

const ExpenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  note: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  userEmail: { type: String, default: "" },
}, {
  timestamps: true,
})

export default mongoose.models[modelName] || mongoose.model(modelName, ExpenseSchema)