import { connectDB } from "../../../../lib/models/db";
import Otp from "../../../../lib/models/Otp";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB()
    const { email, otp } = await req.json()
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const normalizedOtp = String(otp || '').trim()

    if (!normalizedEmail || !normalizedOtp) {
      return NextResponse.json({ success: false, message: 'Email and OTP are required.' }, { status: 400 })
    }

    const record = await Otp.findOne({ email: normalizedEmail, otp: normalizedOtp })

    if (!record) {
      return NextResponse.json({ success: false, message: 'Invalid or expired OTP' }, { status: 400 })
    }

    return NextResponse.json({ success: true, expiresIn: 300, otpId: record._id })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message || 'OTP verification failed' }, { status: 500 })
  }
}