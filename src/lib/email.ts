import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '')

const FROM = process.env.SENDGRID_FROM_EMAIL ?? 'no-reply@tiesverse.com'

export async function sendRegistrationConfirmation(params: {
  to: string
  toName: string
  eventTitle: string
  eventDate: string
  eventTime: string
  venueType: string
  locationText: string | null
  meetingUrl: string | null
  ticketId: string
}) {
  if (!process.env.SENDGRID_API_KEY) return

  const locationLine =
    params.venueType === 'ONLINE'
      ? params.meetingUrl
        ? `Join online: ${params.meetingUrl}`
        : 'Online event — meeting link will be shared soon.'
      : params.locationText ?? 'Venue details will be shared soon.'

  const msg = {
    to: { email: params.to, name: params.toName },
    from: FROM,
    subject: `You're registered: ${params.eventTitle}`,
    text: [
      `Hi ${params.toName},`,
      ``,
      `You're officially registered for ${params.eventTitle}.`,
      ``,
      `📅 Date: ${params.eventDate}`,
      `⏰ Time: ${params.eventTime}`,
      `📍 ${locationLine}`,
      ``,
      `Your ticket ID: ${params.ticketId}`,
      ``,
      `See you there!`,
      `— Tiesverse Team`,
    ].join('\n'),
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Registration Confirmed</title></head>
<body style="font-family:'Manrope',Helvetica,Arial,sans-serif;background:#fffaf2;color:#1d160d;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;border:1px solid #ecdfcd;overflow:hidden;">
        <tr>
          <td style="background:#fff3e3;padding:32px 40px;border-bottom:1px solid #ecdfcd;">
            <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.14em;color:#fe7a00;text-transform:uppercase;">Tiesverse</p>
            <h1 style="margin:8px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:400;letter-spacing:-0.02em;color:#1d160d;">You're registered!</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="margin:0 0 24px;color:rgba(29,22,13,0.6);">Hi ${params.toName},<br>Your spot is confirmed for:</p>
            <h2 style="margin:0 0 24px;font-size:18px;font-weight:600;color:#1d160d;">${params.eventTitle}</h2>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 14px;background:#fffaf2;border:1px solid #ecdfcd;border-radius:4px;margin-bottom:8px;display:block;">
                  <span style="font-size:11px;color:rgba(29,22,13,0.55);text-transform:uppercase;letter-spacing:0.05em;">Date</span><br>
                  <span style="color:#1d160d;font-weight:600;">${params.eventDate}</span>
                </td>
              </tr>
              <tr><td height="8"></td></tr>
              <tr>
                <td style="padding:10px 14px;background:#fffaf2;border:1px solid #ecdfcd;border-radius:4px;">
                  <span style="font-size:11px;color:rgba(29,22,13,0.55);text-transform:uppercase;letter-spacing:0.05em;">Time</span><br>
                  <span style="color:#1d160d;font-weight:600;">${params.eventTime}</span>
                </td>
              </tr>
              <tr><td height="8"></td></tr>
              <tr>
                <td style="padding:10px 14px;background:#fffaf2;border:1px solid #ecdfcd;border-radius:4px;">
                  <span style="font-size:11px;color:rgba(29,22,13,0.55);text-transform:uppercase;letter-spacing:0.05em;">Location</span><br>
                  <span style="color:#1d160d;font-weight:600;">${locationLine}</span>
                </td>
              </tr>
            </table>

            <div style="margin:28px 0;padding:16px;background:rgba(254,122,0,0.06);border:1px solid rgba(254,122,0,0.3);border-radius:4px;text-align:center;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#e56d00;text-transform:uppercase;letter-spacing:0.08em;">Your Ticket</p>
              <p style="margin:0;font-size:20px;font-weight:700;letter-spacing:0.15em;color:#e56d00;">${params.ticketId}</p>
            </div>

            <p style="margin:0;font-size:13px;color:rgba(29,22,13,0.55);">Questions? Reply to this email.<br>— Tiesverse Team</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  }

  try {
    await sgMail.send(msg)
  } catch (err) {
    console.error('[email] failed to send registration confirmation:', err)
  }
}
