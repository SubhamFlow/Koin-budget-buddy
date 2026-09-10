import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'

const groqUrl = 'https://api.groq.com/openai/v1/chat/completions'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ message: 'GROQ_API_KEY is not configured.' }, { status: 503 })
    }

    const body = await req.json()
    const expenses = Array.isArray(body.expenses) ? body.expenses.slice(0, 100) : []
    const budget = Number.isFinite(Number(body.budget)) && Number(body.budget) >= 0
      ? Number(body.budget)
      : null

    const expenseSummary = expenses.map((expense) => ({
      amount: Number(expense.amount) || 0,
      category: String(expense.category || 'Other').slice(0, 40),
      note: String(expense.note || '').slice(0, 120),
      date: expense.date,
    }))

    const response = await fetch(groqUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
        temperature: 0.4,
        max_completion_tokens: 500,
        reasoning_effort: 'low',
        messages: [
          {
            role: 'system',
            content: 'You are Koin, a practical and kind personal money coach. Give concise, specific advice based only on the provided spending and budget data. Never shame the user or invent missing facts. Mention that the budget is not set when it is null. Return plain text in 2 to 4 short sentences, with no markdown heading.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              monthlyBudget: budget,
              expenses: expenseSummary,
            }),
          },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Groq coach request failed:', data)
      return NextResponse.json({ message: 'The money coach is temporarily unavailable.' }, { status: 502 })
    }

    const advice = data.choices?.[0]?.message?.content?.trim()

    if (!advice) {
      return NextResponse.json({ message: 'The money coach did not return advice.' }, { status: 502 })
    }

    return NextResponse.json({ advice })
  } catch (error) {
    console.error('Money coach request failed:', error)
    return NextResponse.json({ message: 'Unable to generate money advice right now.' }, { status: 500 })
  }
}