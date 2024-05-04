const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    service: "gmail", 
    port: 587,
    auth: {
        user:"lerouxlrx@gmail.com",
        pass: "iyte qedh wkro jehw"
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transport;