const nodemailer = require('nodemailer');

exports.handler = async (event) => {
    // Restrict the function to handle only POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' }),
        };
    }

    try {
        // Parse the incoming request body
        const { name, email, message } = JSON.parse(event.body);

        // Validate the required fields
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields' }),
            };
        }

        // Create a transporter for sending emails
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can replace this with other services (e.g., Outlook, Yahoo)
            auth: {
                user: process.env.SMTP_USER, // Use environment variables for credentials
                pass: process.env.SMTP_PASS, // Gmail App Password or SMTP password
            },
        });

        // Configure email options
        const mailOptions = {
            from: `"${name}" <${email}>`, // Sender's name and email
            to: process.env.SMTP_USER, // Your email to receive messages
            subject: `New message from ${name}`, // Subject of the email
            text: message, // The email content
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully' }),
        };
    } catch (error) {
        // Handle and return any errors
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to send email', error: error.message }),
        };
    }
};
