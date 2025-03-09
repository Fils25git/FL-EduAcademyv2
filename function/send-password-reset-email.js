const sgMail = require('@sendgrid/mail');

// Set your SendGrid API key here
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const { email, resetLink } = body;

    const message = {
      to: email,
      from: 'support@fleduacademy.com',
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request this change, please ignore this email.</p>
        <p>Best regards,<br/>The FL EduAcademy Team</p>
      `,
    };

    await sgMail.send(message);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Password reset email sent successfully.' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send password reset email.' }),
    };
  }
};
