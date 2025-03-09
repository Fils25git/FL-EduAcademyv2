const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  try {
    const { email, resetLink } = JSON.parse(event.body);

    const message = {
      to: email,
      from: 'support@fleduacademy.com',
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request this, please ignore this email.</p>
        <p>FL EduAcademy Team</p>
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
