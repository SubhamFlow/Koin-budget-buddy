import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/route'
import { connectDB } from '../../../../../lib/models/db'
import Expense from '../../../../../lib/models/Expense'

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const result = await Expense.deleteMany({ userEmail: session.user.email })

    return NextResponse.json({
      message: 'Expenses cleared',
      deletedCount: result.deletedCount || 0,
    })
  } catch (error) {
    console.error('Expense reset failed:', error)
    return NextResponse.json({ message: 'Failed to clear expenses' }, { status: 500 })
  }
}
