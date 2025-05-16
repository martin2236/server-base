const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // o 'outlook', 'hotmail', etc.
  auth: {
    user: process.env.PROD_EMAIL_FROM, 
    pass: process.env.PROD_EMAIL_PASS  
  }
});

const devTransporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.DEV_EMAIL_FROM,
      pass: process.env.DEV_EMAIL_PASS
    }
  });

const enviarEmailVerificacion = async (correoDestino, nombreUsuario, linkVerificacion) => {
  const mailOptions = {
    from: `"Martin Medina" <${process.env.STAGE == "development" ? process.env.DEV_EMAIL_FROM : process.env.PROD_EMAIL_FROM}>`,
    to: correoDestino,
    subject: 'Verifica tu cuenta',
    html: `
      <h3>Hola ${nombreUsuario} 👋</h3>
      <p>Gracias por registrarte. Por favor verifica tu correo haciendo clic en el siguiente enlace:</p>
      <a href="${linkVerificacion}">Verificar cuenta</a>
      <p>Si tú no realizaste este registro, ignora este correo.</p>
    `
  };

  await process.env.STAGE == "development" ? devTransporter.sendMail(mailOptions) : transporter.sendMail(mailOptions);
};

module.exports = {
  enviarEmailVerificacion
};
