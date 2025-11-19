import sgMail from '@sendgrid/mail'

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface EmailOptions {
    to: string
    subject: string
    html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
    if (!process.env.SENDGRID_API_KEY) {
        console.warn('SENDGRID_API_KEY is not set. Email simulation:', { to, subject })
        return
    }

    try {
        await sgMail.send({
            to,
            from: 'noreply@subsentry.com', // Change this to a verified sender
            subject,
            html,
        })
    } catch (error) {
        console.error('Error sending email', error)
        throw error
    }
}

export function getReminderEmailHtml(serviceName: string, amount: number, days: number) {
    return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Subscription Renewal Reminder</h1>
      <p>Hello,</p>
      <p>This is a friendly reminder that your <strong>${serviceName}</strong> subscription is set to renew in <strong>${days} days</strong>.</p>
      <p>Amount: <strong>$${amount}</strong></p>
      <p>If you wish to cancel or pause this subscription, please visit the service provider's website.</p>
      <br/>
      <p>Stay on top of your finances,</p>
      <p>The SubSentry Team</p>
    </div>
  `
}
