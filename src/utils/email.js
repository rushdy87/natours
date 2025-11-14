// eslint-disable-next-line import/no-extraneous-dependencies
import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Admin <admin@natours.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html, // If you want to send HTML emails
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions);
};

// Notes about Nodemailer:
// transporter: An object that is responsible for sending the email. It contains the configuration for the email service (like SMTP settings).
// mailOptions: An object that defines the email's content and metadata, such as sender, recipient, subject, and body.
// sendMail: A method of the transporter object that actually sends the email using the defined mail options.
// SMTP: Simple Mail Transfer Protocol, a protocol for sending emails across the Internet.
// With well known email services you might not need to provide all these details, as nodemailer has predefined settings for services like Gmail, Yahoo, etc.
