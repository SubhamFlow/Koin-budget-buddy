import nodemailer from 'nodemailer'

const formatName = (name) => name?.trim() || 'there'

export const buildKoinWelcomeHtml = (name) => {
  const safeName = formatName(name)

  return `
    <div style="margin:0;padding:0;background:#f4f7f5;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:640px;margin:32px auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 12px 30px rgba(15, 23, 42, 0.08);">
        <div style="background:linear-gradient(135deg,#0f766e,#10b981);padding:28px 32px;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:1.4px;text-transform:uppercase;opacity:0.9;">Koin</div>
          <h1 style="margin:12px 0 0;font-size:32px;line-height:1.2;font-weight:700;">Welcome aboard, ${safeName}!</h1>
        </div>

        <div style="padding:30px 32px 20px;color:#1f2937;">
          <p style="margin:0 0 18px;font-size:16px;line-height:1.7;">
            You have successfully signed in with Google to <strong>Koin</strong>.
          </p>

          <p style="margin:0 0 18px;font-size:16px;line-height:1.7;">
            Koin is a smart budgeting companion built to help you track expenses, understand your spending, and stay on top of your money with less stress.
          </p>

          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:18px 20px;margin:22px 0;">
            <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#065f46;letter-spacing:0.5px;text-transform:uppercase;">What Koin helps you do</p>
            <ul style="margin:0;padding-left:20px;color:#14532d;font-size:15px;line-height:1.8;">
              <li>Track daily and monthly spending</li>
              <li>See where your money is going</li>
              <li>Organize expenses by category</li>
              <li>Build better financial habits with clarity</li>
            </ul>
          </div>

          <p style="margin:0 0 24px;font-size:16px;line-height:1.7;">
            Start adding your expenses and let Koin turn your numbers into a cleaner, smarter money routine.
          </p>

          <div style="text-align:center;">
            <a href="http://localhost:3000/dashboard" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:600;font-size:15px;">
              Open your dashboard
            </a>
          </div>
        </div>

        <div style="padding:0 32px 26px;color:#6b7280;font-size:13px;line-height:1.6;">
          <p style="margin:0;border-top:1px solid #e5e7eb;padding-top:18px;">
            Best regards,<br>
            <strong style="color:#0f172a;">The Koin Team</strong>
          </p>
        </div>
      </div>
    </div>
  `
}

export const buildOtpEmailHtml = (otp) => {
  return `
    <div style="margin:0;padding:0;background:#f4f7f5;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:640px;margin:32px auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 12px 30px rgba(15, 23, 42, 0.08);">
        <div style="background:linear-gradient(135deg,#0f766e,#10b981);padding:28px 32px;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:1.4px;text-transform:uppercase;opacity:0.9;">Koin</div>
          <h1 style="margin:12px 0 0;font-size:30px;line-height:1.2;font-weight:700;">Your verification code</h1>
        </div>

        <div style="padding:30px 32px;color:#1f2937;">
          <p style="margin:0 0 18px;font-size:16px;line-height:1.7;">
            Use the verification code below to continue signing in to Koin.
          </p>

          <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:18px;text-align:center;margin:22px 0;">
            <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#065f46;font-weight:700;margin-bottom:8px;">One-time password</div>
            <div style="font-size:36px;letter-spacing:8px;font-weight:700;color:#064e3b;">${otp}</div>
          </div>

          <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#4b5563;">
            This code expires in 5 minutes for your security.
          </p>
        </div>
      </div>
    </div>
  `
}

export const sendMail = async (to, subject, text, html) => {
  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS
  const configuredFrom = process.env.EMAIL_FROM
  const fromAddress = configuredFrom && !configuredFrom.includes('your-koin-email@example.com')
    ? configuredFrom
    : emailUser

  if (!emailUser || !emailPass) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be set in .env.local. For Gmail, use an App Password instead of your normal Gmail password.')
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  })

  await transporter.sendMail({
    from: {
      name: process.env.EMAIL_FROM_NAME || 'Koin',
      address: fromAddress,
    },
    to,
    subject,
    text,
    html: html || text,
  })
}