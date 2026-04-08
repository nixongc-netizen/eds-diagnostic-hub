import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { name, email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const firstName = name?.split(' ')[0] || 'there';

  try {
    await resend.emails.send({
      from: 'Dr. Nixon | MyEDSTest <guide@myedstest.com>',
      to: email,
      subject: `${firstName}, here's your hEDS Clinical Summary`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <div style="background:#0b1e3d;padding:0;">
    <div style="background:#c9a84c;padding:8px 40px;">
      <span style="font-size:11px;font-weight:600;letter-spacing:2px;color:#0b1e3d;text-transform:uppercase;">myedstest.com</span>
    </div>
    <div style="padding:30px 40px 26px;">
      <h1 style="font-size:22px;font-weight:700;color:white;margin:0 0 6px;">Your hEDS Clinical Summary</h1>
      <p style="font-size:13px;color:rgba(255,255,255,0.6);margin:0;">Gavin Nixon, D.O. &bull; MyEDSTest.com</p>
    </div>
  </div>

  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <p style="font-size:16px;color:#1e293b;line-height:1.7;margin-bottom:16px;">Hi ${firstName},</p>
    <p style="font-size:15px;color:#374151;line-height:1.7;margin-bottom:20px;">
      Your clinical summary PDF has already downloaded to your device. This email is your copy for reference.
    </p>

    <div style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="font-size:14px;color:#78350f;margin:0;line-height:1.7;">
        <strong>Bring this report to your next appointment.</strong> It includes your Beighton Score, BPI pain severity and interference means, FSS fatigue score, and specialist referral recommendations — all in physician-readable format.
      </p>
    </div>

    <div style="background:#eff6ff;border-radius:10px;padding:20px;margin-bottom:24px;">
      <p style="font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#1e40af;margin:0 0 12px;">What to say at your appointment</p>
      <p style="font-size:14px;color:#1e3a8a;font-style:italic;line-height:1.8;margin:0;">
        "I completed a structured self-assessment using the 2017 international hEDS diagnostic criteria and validated instruments. My Beighton Score, BPI scores, and FSS score are on this report. I'd like to discuss whether these findings warrant a connective tissue specialist referral."
      </p>
    </div>

    <div style="text-align:center;margin:28px 0;">
      <a href="https://myedstest.com"
         style="display:inline-block;background:#0b1e3d;color:white;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;">
        Return to MyEDSTest &rarr;
      </a>
    </div>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
      <p style="font-size:13px;color:#166534;margin:0;line-height:1.6;">
        <strong>Want the full treatment guide?</strong> The hEDS Master Guide includes treatment protocols, 
        doctor appointment scripts, POTS and MCAS management, pain by body region, supplement protocols, 
        and a 14-section clinical framework — written by a physician who treats hEDS daily.<br><br>
        <a href="https://myedstest.com" style="color:#166534;font-weight:600;">Get the hEDS Master Guide — $67 &rarr;</a>
      </p>
    </div>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
    <p style="font-size:11px;color:#9ca3af;text-align:center;margin:0;">
      MyEDSTest.com &bull; Gavin Nixon, D.O. &bull; For educational purposes only.
    </p>
  </div>
</body>
</html>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Send report email failed:', err.message);
    return res.status(500).json({ error: 'Email failed' });
  }
}
