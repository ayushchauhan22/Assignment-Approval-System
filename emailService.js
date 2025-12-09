const nodemailer = require("nodemailer");

async function sendOTPEmail(email, name, password, retries = 3) {
    try {
        console.log("SMTP_USER:", process.env.SMTP_USER);
        console.log("SMTP_PASS:", process.env.SMTP_PASS ? "***" : "undefined");

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: `"MyApp" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Your Email and Password",
            html: `
                <h2>Hello, ${name}</h2>
                <p>Your registered email is: <b>${email}</b></p>
                <p>Your password is: <b>${password}</b></p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
        return true;

    } catch (error) {
        console.error("Error sending email:", error);

        const retryableCodes = ['421', '450', '451', '452'];
        const isRetryable =
            error.code === 'EPROTOCOL' &&
            retryableCodes.some(code => error.response && error.response.includes(code));

        if (isRetryable && retries > 0) {
            const delay = Math.pow(2, 3 - retries) * 1000;
            console.log(`Retrying send in ${delay}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));

            // FIX: pass same 3 parameters again
            return sendOTPEmail(email, name, password, retries - 1);
        }

        return false;
    }
}

module.exports = { sendOTPEmail };
