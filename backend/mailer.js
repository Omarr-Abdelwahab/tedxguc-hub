import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;

let transporter;

export const isMailerConfigured = () => Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && SMTP_FROM);

const getTransporter = () => {
  if (!isMailerConfigured()) {
    throw new Error("SMTP is not configured.");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return transporter;
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const sendNewsletterWelcomeEmail = async (email) => {
  const tx = getTransporter();

  await tx.sendMail({
    from: SMTP_FROM,
    to: email,
    subject: "You are subscribed to TEDxGUC news",
    text: "Thanks for subscribing to TEDxGUC updates. You will receive upcoming event and talk news here.",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
        <h2 style="margin-bottom: 8px;">Welcome to TEDxGUC Updates</h2>
        <p>Thanks for subscribing. You will now receive news about upcoming TEDxGUC events, talks, and announcements.</p>
      </div>
    `,
  });
};

export const sendNewsletterBroadcast = async ({ subscribers, subject, message }) => {
  const tx = getTransporter();
  const htmlMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  let sentCount = 0;
  const failures = [];

  for (const subscriber of subscribers) {
    try {
      await tx.sendMail({
        from: SMTP_FROM,
        to: subscriber.email,
        subject,
        text: message,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
            <h2 style="margin-bottom: 8px;">TEDxGUC News</h2>
            <p>${htmlMessage}</p>
          </div>
        `,
      });
      sentCount += 1;
    } catch (error) {
      failures.push({
        email: subscriber.email,
        reason: error instanceof Error ? error.message : "Unknown send error",
      });
    }
  }

  return {
    sentCount,
    failedCount: failures.length,
    failures,
  };
};
