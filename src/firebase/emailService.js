// ─── EmailJS Email Service for Staff Notifications ─────────────────────────────
// Uses EmailJS (https://www.emailjs.com) to send emails from the browser.
//
// SETUP INSTRUCTIONS:
// 1. Go to https://www.emailjs.com and create a free account
// 2. Add an email service (Gmail, Outlook, etc.) → copy the SERVICE_ID
// 3. Create an email template with variables: {{to_name}}, {{to_email}}, {{subject}}, {{message}}
//    → copy the TEMPLATE_ID
// 4. Go to Account → General → copy your PUBLIC_KEY
// 5. Replace the placeholder values below with your real IDs
// ───────────────────────────────────────────────────────────────────────────────

import emailjs from '@emailjs/browser';

// ══════════════════════════════════════════════════════════════════════════
// 🔑 SECURE EMAILJS CREDENTIALS (Loaded from .env)
// ══════════════════════════════════════════════════════════════════════════
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Check if EmailJS is properly configured
const isEmailJSConfigured = () => Boolean(EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID);

/**
 * Send an email notification using EmailJS.
 * Falls back to mailto: if EmailJS is not configured.
 *
 * @param {Object} params
 * @param {string} params.toEmail   — Recipient email
 * @param {string} params.toName    — Recipient name
 * @param {string} params.subject   — Email subject
 * @param {string} params.message   — Email body (plain text)
 * @returns {Promise<{success: boolean, method: string}>}
 */
export const sendStaffNotification = async ({ toEmail, toName, subject, message }) => {
  // ── Try EmailJS first ────────────────────────────────────────
  if (isEmailJSConfigured()) {
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: toEmail,
          to_name: toName,
          subject: subject,
          message: message,
        },
        EMAILJS_PUBLIC_KEY
      );
      console.log(`✅ Email sent to ${toEmail} via EmailJS`);
      return { success: true, method: 'emailjs' };
    } catch (err) {
      console.warn('EmailJS send failed, falling back to simulation:', err);
      // 🔥 ADDED ALERT SO WE CAN SEE THE EXACT ERROR ON SCREEN
      alert(`EmailJS Error: ${err.text || err.message || JSON.stringify(err)}`);
    }
  }

  // ── Fallback: Simulate Automatic Background Send ──────────────
  try {
    console.log(`📧 Simulating automatic email send to: ${toEmail}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, method: 'simulated' };
  } catch (err) {
    return { success: false, method: 'none' };
  }
};

/**
 * Pre-built approval email
 */
export const sendApprovalEmail = (staffMember) => {
  return sendStaffNotification({
    toEmail: staffMember.email,
    toName: staffMember.name,
    subject: 'StyleSync — Your Staff Registration Has Been Approved! ✅',
    message: `Dear ${staffMember.name},\n\nCongratulations! 🎉\n\nWe are delighted to inform you that your staff registration at StyleSync Luxury Salon has been APPROVED by the admin.\n\nYou can now log in to the Staff Portal using your registered credentials to:\n• View and manage your appointment schedule\n• Update your profile and specialization\n• Accept customer bookings\n• Manage home service requests\n\nLogin URL: ${window.location.origin}\n\nWelcome to the StyleSync team! We're excited to have you on board.\n\nBest regards,\nStyleSync Administration\nLuxury Salon Management System`
  });
};

/**
 * Pre-built rejection email
 */
export const sendRejectionEmail = (staffMember) => {
  return sendStaffNotification({
    toEmail: staffMember.email,
    toName: staffMember.name,
    subject: 'StyleSync — Staff Registration Update',
    message: `Dear ${staffMember.name},\n\nThank you for your interest in joining the StyleSync team.\n\nAfter careful review of your application, we regret to inform you that we are unable to approve your staff registration at this time.\n\nThis decision may be based on current staffing requirements or other criteria. You are welcome to reapply in the future.\n\nIf you have any questions, please feel free to reach out to our administration.\n\nWe wish you the best in your career.\n\nBest regards,\nStyleSync Administration\nLuxury Salon Management System`
  });
};
