import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface LeadEmailPayload {
  postalCode: string
  projectType: string
  description: string
  estimate: string
  source?: string
  affiliateId?: string
}

export async function sendLeadEmail(payload: LeadEmailPayload) {
  const fromEmail = process.env.FROM_EMAIL || 'leads@quotexbert.com'
  const toEmail = process.env.TO_EMAIL || 'owner@quotexbert.com'

  const emailContent = {
    from: fromEmail,
    to: toEmail,
    subject: `New quotexbert lead - ${payload.projectType}`,
    html: `
      <h2>New Lead Submitted</h2>
      <p><strong>Project Type:</strong> ${payload.projectType}</p>
      <p><strong>Postal Code:</strong> ${payload.postalCode}</p>
      <p><strong>Description:</strong> ${payload.description}</p>
      <p><strong>Estimated Value:</strong> ${payload.estimate}</p>
      <p><strong>Source:</strong> ${payload.source || 'web'}</p>
      ${payload.affiliateId ? `<p><strong>Affiliate ID:</strong> ${payload.affiliateId}</p>` : ''}
      <hr>
      <p><em>Submitted via quotexbert.com</em></p>
    `
  }

  if (!resend) {
    console.log('RESEND_API_KEY not configured. Email would be sent with content:', emailContent)
    return { success: true }
  }

  try {
    await resend.emails.send(emailContent)
    return { success: true }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}
