import { connectDB } from "../../../../lib/models/db"
import { NextResponse } from "next/server"
import Expense from "../../../../lib/models/Expense"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const expenses = await Expense.find({ userEmail: session.user.email }).sort({ date: -1 })
  return NextResponse.json(expenses)
}

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()
  const amount = Number(body.amount)
  const category = String(body.category || '').trim()
  const note = String(body.note || '').trim().slice(0, 300)
  const date = body.date ? new Date(body.date) : new Date()

  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000000 || !category || Number.isNaN(date.getTime())) {
    return NextResponse.json({ message: 'Enter a valid amount, category, and date.' }, { status: 400 })
  }

  const expense = await Expense.create({
    amount,
    category: category.slice(0, 40),
    note,
    date,
    userEmail: session.user.email,
  })

  return NextResponse.json(expense)
}