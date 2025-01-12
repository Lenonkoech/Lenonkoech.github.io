const nodemailer = require('nodemailer');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' }),
        };
    }

    const { name, email, message } = JSON.parse(event.body);

    if (!name || !email || !message) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing required fields' }),
        };
    }

    // Configuration for email service (e.g., Gmail, SMTP)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'koechlenon@gmail.com',
            pass: 'K6jmfele',
        },
    });

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: 'koechlenon@gmail.com', // Your email to receive messages
        subject: `New message from ${name}`,
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to send email', error: error.message }),
        };
    }
};
