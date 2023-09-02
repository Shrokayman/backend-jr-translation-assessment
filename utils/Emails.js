import nodemailer from "nodemailer";
import path from 'path';
import hbs from 'nodemailer-express-handlebars';


const sendEmail = async (emailOptions) => {
    try {
        var mail = nodemailer.createTransport({
            service: 'gmail',
            pool: true,
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.GMAIL_APP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let message = {}
        message = emailOptions.isHtml === true ? {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: emailOptions.email,

            subject: emailOptions.subject,
            template: emailOptions.template,
            context: emailOptions.context,
        } : {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: emailOptions.email,

            subject: emailOptions.subject,
            text: emailOptions.message,
        };

        // point to the template folder
        const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve('./views/'),
                defaultLayout: false,
            },
            viewPath: path.resolve('./views/'),
        };

        // use a template file with nodemailer
        mail.use('compile', hbs(handlebarOptions))
        let res = await mail.sendMail(message);
        console.log('Email sent success: ', res.response)
        mail.close();
    }
    catch (e) {
        console.log("Error: ", e)
    }
}
export { sendEmail };