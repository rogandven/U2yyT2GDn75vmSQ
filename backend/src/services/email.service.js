import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PROVIDER, EMAIL_PASSWORD,EXMAPLE_EMAIL_2,EMAIL_PASSWORD_PROFE,EXMAPLE_EMAIL_1 } from "../config/configEnv.js";


export const sendMail = async(to, subject, text,html) => {
    try {
    if (!EXMAPLE_EMAIL_2 || !EMAIL_PASSWORD_PROFE) {
      throw new Error("EXMAPLE_EMAIL_2  o EMAIL_PASSWORD_PROFE no están configurados en .env");
    }

    console.log("[Email Service] Configurando transporter...");

    // Configurar el transportador de Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EXMAPLE_EMAIL_2,
        pass: EMAIL_PASSWORD_PROFE,
      },
    });

    const mailOptions = {
        from: `"Mensaje de solicitud de realizar electivo" <${EXMAPLE_EMAIL_2}>`,
        to: `<${EXMAPLE_EMAIL_1}>`,
        subject: subject,
        text: text,
        html:html
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);
    console.log("[Email Service] Correo enviado exitosamente:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("[Email Service] Error al enviar correo:", error.message);
    throw new Error("Error enviando el correo: " + error.message);
  }
}
