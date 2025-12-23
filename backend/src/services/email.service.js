import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PROVIDER, EMAIL_PASSWORD } from "../config/configEnv.js";

export const sendMail = async (to, subject, text) => {
    const throwError = (error) => {
        throw error;
    }

    try {
        const mailOptions = {
            from: EMAIL,
            to: to,
            subject: subject,
            text: text
        };

        const transporter = nodemailer.createTransport({
            service: EMAIL_PROVIDER,
            auth: {
                user: EMAIL,
                pass: EMAIL_PASSWORD
            }
        });

        const result = await transporter.sendMail(mailOptions, function(error, info){
            throwError(Error("xd", {sent: ((!error && true) || false), info: info, error: error}));
        });
    } catch (error) {
        console.error(error);
        return error.options;
    }

    
}

export default sendMail;