const sgMail = require('@sendgrid/mail');

// Set your SendGrid API key here
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const { email, firstName, lastName } = body;

    const message = {
      to: email,
      from: 'support@fleduacademy.com',
      subject: 'Welcome to FL EduAcademy!',
      html: `
        <h1>Hello ${firstName} ${lastName},</h1>
        <p>Welcome to FL EduAcademy! We're excited to have you on board. You can now log in and start exploring the platform.</p>
        <p>If you need any assistance, feel free to reach out to us at <a href="mailto:support@fleduacademy.com">support@fleduacademy.com</a>.</p>
        <p>Best regards,<br/>The FL EduAcademy Team</p>
      `,
    };

    await sgMail.send(message);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Confirmation email sent successfully.' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send confirmation email.' }),
    };
  }
};
