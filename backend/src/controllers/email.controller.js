import { sendMail as service_sendMail } from "../services/email.service.js";

export const sendMail = async (req, res) => {
        try {
            const sentMail = await service_sendMail(req.body.to, req.body.subject, req.body.text);
            console.log(sentMail);
        } catch (error) {
            console.error(error);
        }
}