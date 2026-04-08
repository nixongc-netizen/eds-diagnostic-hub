import Stripe from 'stripe';
import { Resend } from 'resend';

export const config = {
  api: { bodyParser: false }, // Stripe needs raw body to verify signature
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const guideEmailHtml = (name) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your hEDS Master Guide</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <!-- Header -->
  <div style="background:#0b1e3d;padding:0;">
    <div style="background:#c9a84c;padding:8px 40px;">
      <span style="font-size:11px;font-weight:600;letter-spacing:2px;color:#0b1e3d;text-transform:uppercase;">myedstest.com</span>
    </div>
    <div style="padding:36px 40px 30px;">
      <div style="font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#c9a84c;margin-bottom:10px;">Physician-Authored Clinical Guide</div>
      <h1 style="font-size:28px;font-weight:700;color:white;margin:0 0 6px;line-height:1.2;">The hEDS Treatment Guide</h1>
      <p style="font-size:14px;color:rgba(255,255,255,0.65);margin:0;">Gavin Nixon, D.O. &bull; Interventional Pain Medicine &bull; Regenexx Certified Provider</p>
    </div>
  </div>

  <!-- Body -->
  <div style="max-width:580px;margin:0 auto;padding:36px 24px;">

    <p style="font-size:16px;color:#1e293b;line-height:1.7;margin-bottom:16px;">
      Hi ${name || 'there'},
    </p>
    <p style="font-size:16px;color:#374151;line-height:1.7;margin-bottom:24px;">
      Thank you for purchasing the hEDS Master Guide. Your access is ready — click the button below to open it.
    </p>

    <!-- CTA -->
    <div style="text-align:center;margin:32px 0;">
      <a href="https://myedstest.com/?purchased=true"
         style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;text-decoration:none;padding:18px 40px;border-radius:12px;font-size:17px;font-weight:700;letter-spacing:0.3px;">
        Open My hEDS Guide &rarr;
      </a>
      <p style="font-size:12px;color:#9ca3af;margin-top:12px;">Bookmark that page to return anytime — your access is permanent.</p>
    </div>

    <!-- What's inside -->
    <div style="background:#f0f4ff;border-radius:12px;padding:24px;margin-bottom:28px;">
      <p style="font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6b7280;margin:0 0 16px;">What's inside your guide</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${[
          ['🩺', 'Doctor Appointment Toolkit', 'Word-for-word scripts for every specialist — PCP, pain physician, cardiologist, rheumatologist'],
          ['🫀', 'POTS & Dysautonomia', 'Home testing protocol, salt/compression strategy, stellate ganglion block explained'],
          ['🔥', 'MCAS & Histamine', 'Low-histamine diet, H1+H2 protocol, what to trial before your allergist visit'],
          ['💊', 'Treatment Options', 'PRP, LDN, RFA, SI joint injections — what to ask for and what to avoid'],
          ['🦴', 'Pain by Body Region', 'Neck, back, shoulder, ribs, hip, knee, hands — root cause and referral path'],
          ['⚡', 'Pacing & Energy', 'Break the push-crash cycle. HR-based pacing and the flare protocol'],
          ['💊', 'Supplements', 'Evidence-based protocol — quercetin, PEA, magnesium, Vitamin D3+K2, fish oil'],
          ['😴', 'Sleep & Circadian Rhythm', 'POMC, red light therapy, 5 circadian principles for fatigue recovery'],
        ].map(([icon, title, desc]) => `
          <tr>
            <td style="padding:8px 0;vertical-align:top;width:28px;font-size:18px;">${icon}</td>
            <td style="padding:8px 0 8px 10px;vertical-align:top;">
              <div style="font-size:14px;font-weight:600;color:#1e293b;margin-bottom:2px;">${title}</div>
              <div style="font-size:13px;color:#64748b;line-height:1.5;">${desc}</div>
            </td>
          </tr>
        `).join('')}
      </table>
    </div>

    <!-- Sections list -->
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
      <p style="font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6b7280;margin:0 0 12px;">14 clinical sections</p>
      <p style="font-size:13px;color:#64748b;line-height:2;margin:0;">
        Genetic Testing &amp; Diagnosis &bull; POTS &amp; Dysautonomia &bull; MCAS &bull; Supplements &bull;
        Pain by Body Region &bull; Physical Therapy Resources &bull; Low Dose Naltrexone &bull;
        Sleep &amp; Circadian Rhythm &bull; Peptides &bull; Pacing &amp; Energy &bull;
        Nutrition for Connective Tissue &bull; Flare Protocol &bull; What to Avoid &bull;
        Doctor Appointment Toolkit &bull; Resources Hub
      </p>
    </div>

    <!-- Money back -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;margin-bottom:28px;text-align:center;">
      <p style="font-size:14px;color:#166534;margin:0;">
        🔒 <strong>100% money-back guarantee.</strong> If this guide doesn't give you a clearer path forward, email us at <a href="mailto:support@myedstest.com" style="color:#166534;">support@myedstest.com</a> for a full refund.
      </p>
    </div>

    <!-- Footer -->
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;">
    <p style="font-size:12px;color:#9ca3af;text-align:center;line-height:1.7;margin:0;">
      This guide is for educational purposes only and does not establish a physician-patient relationship.<br>
      &copy; 2026 MyEDSTest.com &bull; Gavin Nixon, D.O.
    </p>
  </div>

</body>
</html>
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const resend = new Resend(process.env.RESEND_API_KEY);

  let event;
  try {
    const rawBody = await getRawBody(req);
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_details?.email;
    const name = session.customer_details?.name?.split(' ')[0] || '';

    if (email) {
      try {
        await resend.emails.send({
          from: 'Dr. Nixon | MyEDSTest <guide@myedstest.com>',
          to: email,
          subject: `${name ? name + ', your' : 'Your'} hEDS Master Guide is ready`,
          html: guideEmailHtml(name),
        });
        console.log(`Guide email sent to ${email}`);
      } catch (emailErr) {
        console.error('Email send failed:', emailErr.message);
        // Don't fail the webhook — Stripe will retry on error responses
      }
    }
  }

  return res.status(200).json({ received: true });
}
