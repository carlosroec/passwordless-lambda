var Mailgun = require('mailgun-js');

module.exports = send = (to, subject, template, data) => {
    var mailgun = new Mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

    const message = {
        from: process.env.MAILGUN_FROM,
        to: to,
        subject: subject,
        template: template,
        'h:X-Mailgun-Variables': JSON.stringify(data)
    }

    mailgun.messages().send(message);
}
