const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendRegistrationEmail = async (to, name) => {
  const mailOptions = {
    from: `"WorkBuddy" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎉 Welcome to Our Service Platform!",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f8fa; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Welcome, ${name}!</h1>
          </div>
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">We're excited to have you on board as a <strong>Worker</strong> on our platform.</p>
            <p style="font-size: 15px;">
              You can now:
              <ul style="padding-left: 20px;">
                <li style="padding-bottom:2px;>🛠️ Offer your services to a wide range of customers</li>
                <li style="padding-bottom:2px;>📥 Receive and manage service requests in real time</li>
                <li style="padding-bottom:2px;>📊 Build your profile and showcase your skills</li>
              </ul>
            </p>
            <p style="font-size: 16px;">
              Start exploring your dashboard and keep your profile updated to get more visibility.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://yourplatform.com/login" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Go to Profile
              </a>
            </div>
          </div>
          <div style="background-color: #f0f0f0; color: #888; padding: 15px; text-align: center; font-size: 13px;">
            <p style="margin: 0;">If you did not register on our platform, please ignore this email.</p>
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Your Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

const sendCustomerWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: `"WorkBuddy" <${process.env.EMAIL_USER}>`,
    to,
    subject: "👋 Welcome to Our WorkBuddy Service Platform!",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f8fa; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Welcome, ${name}!</h1>
          </div>
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Thanks for signing up as a <strong>Customer</strong> on our platform.</p>
            <p style="font-size: 15px;">
              You can now:
              <ul style="padding-left: 20px;">
                <li style="padding-bottom:2px;">🔍 Browse and search for trusted service providers</li>
                <li style="padding-bottom:2px";>📅 Submit service requests and track progress</li>
                <li style="padding-bottom:2px";>💬 Chat with workers after your request is accepted</li>
              </ul>
            </p>
            <p style="font-size: 16px;">
              Get started by logging into your dashboard and exploring available services.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://yourplatform.com/login" style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Go to Profile
              </a>
            </div>
          </div>
          <div style="background-color: #f0f0f0; color: #888; padding: 15px; text-align: center; font-size: 13px;">
            <p style="margin: 0;">If you did not register on our platform, please ignore this email.</p>
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Your Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendRegistrationEmail,
  sendCustomerWelcomeEmail
};
