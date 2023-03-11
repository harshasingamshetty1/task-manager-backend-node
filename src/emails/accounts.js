const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    from: "harshasingamshetty@gmail.com",
    to: email,
    subject: "Welcome to Task Manager App",
    text:
      "Welcome to the app, " +
      name +
      ". Let us know how you get along with the app.",
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    from: "harshasingamshetty@gmail.com",
    to: email,
    subject: "User deleted from Task-Manager App",
    text:
      " Sorry to disappoint you " +
      name +
      ". Let us know how we can improve the app.",
  });
};
module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
