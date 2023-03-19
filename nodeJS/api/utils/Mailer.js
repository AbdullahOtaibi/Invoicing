const config = require('config');
const nodemailer = require("nodemailer");

export  const   sendEmail =  async (to, subject, body) => {

    let transporter = nodemailer.createTransport({
        host: config.get("mailServer"),
        port: config.get("mailPort"),
        secure: true, // true for 465, false for other ports
        auth: {
          user: config.get("mailUser"), // generated ethereal user
          pass: config.get("mailPassword"), // generated ethereal password
        },
        tls: {
            ciphers: 'SSLv3'
        }
      });

      let info = await transporter.sendMail({
        from: config.get("mailFrom"), // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: body, // html body
      });

}
