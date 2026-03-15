interface MatchItem {
  title: string
  buyer: string
  value: string
  deadline: string
  score: number
  tenderUuid: string
}

interface MatchDigestProps {
  userName: string
  matches: MatchItem[]
  dashboardUrl: string
}

export function renderMatchDigestEmail({ userName, matches, dashboardUrl }: MatchDigestProps): string {
  const matchCards = matches.map((m) => {
    const scoreColor = m.score >= 75 ? '#2563eb' : m.score >= 50 ? '#f59e0b' : '#a1a1aa'
    const scoreBg = m.score >= 75 ? '#eff6ff' : m.score >= 50 ? '#fffbeb' : '#fafafa'
    const priorityLabel = m.score >= 75 ? 'High Match' : m.score >= 50 ? 'Medium' : 'Low'
    const priorityBg = m.score >= 75 ? '#dbeafe' : m.score >= 50 ? '#fef3c7' : '#f4f4f5'
    const priorityColor = m.score >= 75 ? '#1d4ed8' : m.score >= 50 ? '#b45309' : '#71717a'

    return `
      <tr>
        <td style="padding:0 0 12px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;">
            <tr>
              <!-- Score Column -->
              <td width="80" style="background:${scoreBg};border-right:1px solid #e4e4e7;text-align:center;vertical-align:middle;padding:20px 12px;">
                <div style="font-size:24px;font-weight:800;color:${scoreColor};line-height:1;">${m.score}</div>
                <div style="font-size:9px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;">Score</div>
              </td>
              <!-- Content -->
              <td style="padding:16px 20px;">
                <div style="margin-bottom:6px;">
                  <span style="display:inline-block;font-size:10px;font-weight:700;color:${priorityColor};background:${priorityBg};padding:2px 8px;border-radius:10px;text-transform:uppercase;letter-spacing:0.3px;">${priorityLabel}</span>
                </div>
                <a href="${dashboardUrl}/tenders/${m.tenderUuid}"
                   style="font-size:14px;font-weight:700;color:#18181b;text-decoration:none;line-height:1.4;display:block;margin-bottom:6px;">
                  ${escapeHtml(m.title.length > 80 ? m.title.slice(0, 80) + '...' : m.title)}
                </a>
                <table cellpadding="0" cellspacing="0" style="font-size:12px;color:#71717a;">
                  <tr>
                    <td style="padding-right:16px;">
                      <span style="color:#a1a1aa;">Buyer:</span> <span style="color:#52525b;font-weight:500;">${escapeHtml(m.buyer.length > 40 ? m.buyer.slice(0, 40) + '...' : m.buyer)}</span>
                    </td>
                    <td style="padding-right:16px;">
                      <span style="color:#a1a1aa;">Value:</span> <span style="color:#18181b;font-weight:600;">${escapeHtml(m.value)}</span>
                    </td>
                    <td>
                      <span style="color:#a1a1aa;">Deadline:</span> <span style="color:#52525b;font-weight:500;">${escapeHtml(m.deadline)}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your Winly Match Digest</title>
</head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">

          <!-- Header -->
          <tr>
            <td style="padding:28px 32px 24px;border-bottom:1px solid #f4f4f5;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:800;color:#2563eb;letter-spacing:-0.5px;">Winly</span>
                  </td>
                  <td align="right">
                    <span style="font-size:11px;font-weight:600;color:#059669;background:#ecfdf5;border:1px solid #d1fae5;padding:4px 10px;border-radius:8px;">Daily Digest</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:28px 32px 0;">
              <h2 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#18181b;letter-spacing:-0.3px;">
                ${matches.length} new ${matches.length === 1 ? 'match' : 'matches'} found
              </h2>
              <p style="margin:0 0 24px;font-size:14px;color:#71717a;line-height:1.5;">
                Hi ${escapeHtml(userName)}, here are your top procurement opportunities today.
              </p>
            </td>
          </tr>

          <!-- Match Cards -->
          <tr>
            <td style="padding:0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${matchCards}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:24px 32px 32px;text-align:center;">
              <a href="${dashboardUrl}/matches"
                 style="display:inline-block;padding:14px 32px;background:#2563eb;color:#ffffff;
                        font-size:14px;font-weight:700;border-radius:10px;text-decoration:none;letter-spacing:-0.2px;">
                View All Matches
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#fafafa;border-top:1px solid #f4f4f5;">
              <p style="margin:0;font-size:11px;color:#a1a1aa;text-align:center;line-height:1.6;">
                You're receiving this because email notifications are enabled on your
                <a href="${dashboardUrl}/profile" style="color:#71717a;text-decoration:underline;">profile</a>.
                &nbsp;&middot;&nbsp;
                <a href="${dashboardUrl}/profile" style="color:#71717a;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>

        <!-- Sub-footer -->
        <table width="600" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:16px 0;text-align:center;">
              <p style="margin:0;font-size:11px;color:#d4d4d8;">
                Winly &middot; Procurement Intelligence Platform
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
