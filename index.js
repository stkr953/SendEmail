const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors());
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Running on port http://localhost:",PORT,"/sendmail");
});


app.post("/sendmail", (req, res) => {

    const { to, email_body } = req.body;

    console.log(to,  email_body);

    nodemailer.createTestAccount((err, account) => {
        //if error occurs in creating account
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
        }
        //if account is created successfully
        console.log('Credentials obtained, sending message...');

        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
        //data for the mail
        const mailData = {
            from: 'foo@example.com',
            to: to,
            text: email_body
        };
        transporter.sendMail(mailData, (error, info) => {
            if (error) {
                //console.log("this is error")
                res.send({
                    success: false,
                    message: "Error! Could not send the mail",
                    error: error
                });
            }
            else {
                res.status(200).send({
                    success: true,
                    message: "Email sent successfully",
                    info: info
                });
            }
        });
    });
});
