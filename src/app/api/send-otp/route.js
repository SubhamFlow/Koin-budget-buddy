import { sendMail, buildOtpEmailHtml } from "../../../../lib/models/mail";
import { NextResponse } from 'next/server'
import { connectDB } from "../../../../lib/models/db";
import Otp from "../../../../lib/models/Otp";
import { randomInt } from 'crypto'

export async function POST(req) {
  try {
    await connectDB()
    const { email } = await req.json()
    const trimmedEmail = String(email || '').trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ success: false, message: 'Enter a valid email address.' }, { status: 400 })
    }

    const latestOtp = await Otp.findOne({ email: trimmedEmail }).sort({ createdAt: -1 })
    if (latestOtp && Date.now() - latestOtp.createdAt.getTime() < 60 * 1000) {
      return NextResponse.json({ success: false, message: 'Please wait one minute before requesting another code.' }, { status: 429 })
    }

    await Otp.deleteMany({ email: trimmedEmail })
    const cleanOtp = randomInt(100000, 1000000).toString()
    const record = await Otp.create({ email: trimmedEmail, otp: cleanOtp })
    const textMessage = `Your Koin OTP is: ${cleanOtp}. It expires in 5 minutes.`

    await sendMail(trimmedEmail, 'Your Koin OTP', textMessage, buildOtpEmailHtml(cleanOtp))

    return NextResponse.json({ success: true, expiresIn: 300, otpId: record._id })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to send OTP',
    }, { status: 500 })
  }
}