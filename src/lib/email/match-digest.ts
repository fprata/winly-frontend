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
  const matchRows = matches.map((m) => {
    const scoreColor = m.score >= 80 ? '#0d9488' : m.score >= 60 ? '#d97706' : '#64748b'
    return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;">
          <a href="${dashboardUrl}/tenders/${m.tenderUuid}"
             style="font-size:14px;font-weight:600;color:#0f172a;text-decoration:none;">
            ${escapeHtml(m.title)}
          </a>
          <p style="margin:4px 0 0;font-size:12px;color:#64748b;">
            ${escapeHtml(m.buyer)} &nbsp;·&nbsp; ${escapeHtml(m.value)} &nbsp;·&nbsp; Deadline: ${escapeHtml(m.deadline)}
          </p>
        </td>
        <td style="padding:12px 0 12px 16px;border-bottom:1px solid #f1f5f9;text-align:right;white-space:nowrap;">
          <span style="font-size:15px;font-weight:700;color:${scoreColor};">${m.score}%</span>
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
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0f172a;padding:24px 32px;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">
                winly
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;">
                ${matches.length} new tender ${matches.length === 1 ? 'match' : 'matches'} for you
              </h2>
              <p style="margin:0 0 24px;font-size:14px;color:#64748b;">
                Hi ${escapeHtml(userName)}, here are your top procurement opportunities today.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                ${matchRows}
              </table>

              <div style="margin-top:28px;text-align:center;">
                <a href="${dashboardUrl}/matches"
                   style="display:inline-block;padding:12px 28px;background:#0d9488;color:#ffffff;
                          font-size:14px;font-weight:600;border-radius:6px;text-decoration:none;">
                  View All Matches
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #f1f5f9;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                You're receiving this because email notifications are enabled on your
                <a href="${dashboardUrl}/profile" style="color:#64748b;">profile</a>.
                &nbsp;·&nbsp;
                <a href="${dashboardUrl}/profile" style="color:#64748b;">Unsubscribe</a>
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
