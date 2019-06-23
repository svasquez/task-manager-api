const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from: 'smillalexander@gmail.com',
        subject: 'Thanks for joining us!',
        text: `Welcome to the app, ${name}. Let me know how to get along with the app.`
    })
}

const sendCancellationEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from: 'smillalexander@gmail.com',
        subject: 'Why do you got!',
        text: `Please keep in the app, ${name}. Is there some way that we can help you contact with us.`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail,
}