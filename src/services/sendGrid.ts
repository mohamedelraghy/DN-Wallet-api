const nodemailer = require('nodemailer');
const sendgridTransporter = require('nodemailer-sendgrid-transport');

const config = require('config');

const transport = nodemailer.createTransport(
  sendgridTransporter({
    auth: {
      api_key: config.get("sendGrid-api_key"),
    },
  })
);

module.exports = transport;

export{};