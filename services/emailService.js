const nodemailer = require("nodemailer");

async function SendMail({from, to , subject, text, html}){
    let transporter = nodemailer.createTransport({
        host : process.env.SMTP_HOST,
        port : process.env.SMTP_PORT,
        secure : false,
        auth : {
            user : process.env.MAIL_USER,
            pass : process.env.MAIL_PASS
        }
    });

    let info = await transporter.sendMail({
                from :` inShare <${from}>`, //Here we can use object destructing which mean from : from we can write only form
                to :  to,
                subject: subject,
                text : text, 
                html : html,
            })
            console.log(info);
}

module.exports = SendMail;