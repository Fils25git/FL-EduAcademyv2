const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  try {
    const { email, firstName, lastName } = JSON.parse(event.body);

    const message = {
      to: email,
      from: 'support@fleduacademy.com',
      subject: 'Welcome to FL EduAcademy!',
      html: `
        <h1>Dear ${firstName},</h1>
        <p>Welcome to FL EduAcademy! Your account has been created successfully.</p>
        <p>You can now <a href="https://fleduacademy.com/login.html">log in</a> and start learning.</p>
        <p>Best regards,<br/>FL EduAcademy Team</p>
      `,
    };

    await sgMail.send(message);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Signup email sent successfully.' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send signup email.' }),
    };
  }
};
