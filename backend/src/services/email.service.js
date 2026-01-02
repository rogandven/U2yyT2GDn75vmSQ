import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PROVIDER, EMAIL_PASSWORD } from "../config/configEnv.js";

export const sendMail = (to, subject, text) => {
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
    try {
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log(`Email sent to ${String(to)}: ` + info.response);
        }
        });
    } catch (error) {
        console.log(error);
    }
}

export default sendMail;