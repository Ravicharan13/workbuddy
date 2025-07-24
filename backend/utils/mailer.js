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
          
          <!-- Header -->
          <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Welcome, ${name}!</h1>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">We're excited to have you on board as a <strong>Worker</strong> on our platform.</p>
            <p style="font-size: 15px;">You can now:</p>
            <ul style="font-size: 15px; padding-left: 20px; margin-top: -10px;">
              <li style="padding-bottom: 5px;">🛠️ Offer your services to a wide range of customers</li>
              <li style="padding-bottom: 5px;">📥 Receive and manage service requests in real time</li>
              <li style="padding-bottom: 5px;">📊 Build your profile and showcase your skills</li>
            </ul>

            <p style="font-size: 16px;">Here are a few tips to get started:</p>
            <ul style="font-size: 15px; padding-left: 20px;">
              <li>📌 Complete your profile with accurate information and skills</li>
              <li>⏰ Respond quickly to service requests for better ratings</li>
              <li>🌟 Provide quality service to gain customer trust</li>
            </ul>

            <p style="font-size: 16px;">Start exploring your dashboard and keep your profile updated to get more visibility.</p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://yourplatform.com/login" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Go to Profile
              </a>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

            <p style="font-size: 14px; color: #666;">
              🔐 <strong>Security Tip:</strong> Never share your login credentials. If something seems suspicious, report it to <a href="mailto:support@yourplatform.com" style="color: #007bff; text-decoration: none;">support@yourplatform.com</a>.
            </p>

            <div style="text-align: center; margin-top: 20px;">
              <a href="https://facebook.com/yourplatform" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/24/1384/1384005.png" alt="Facebook" /></a>
              <a href="https://twitter.com/yourplatform" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/24/733/733579.png" alt="Twitter" /></a>
              <a href="https://instagram.com/yourplatform" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/24/1384/1384015.png" alt="Instagram" /></a>
            </div>
          </div>

          <!-- Footer -->
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
          
          <!-- Header -->
          <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Welcome, ${name}!</h1>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Thanks for signing up as a <strong>Customer</strong> on our platform.</p>

            <p style="font-size: 15px;">
              You can now:
              <ul style="padding-left: 20px;">
                <li style="padding-bottom:2px;">🔍 Browse and search for trusted service providers</li>
                <li style="padding-bottom:2px;">📅 Submit service requests and track progress</li>
                <li style="padding-bottom:2px;">💬 Chat with workers after your request is accepted</li>
              </ul>
            </p>

            <p style="font-size: 16px;">Here are a few tips to get started:</p>
            <ul style="font-size: 15px; padding-left: 20px;">
              <li>📝 Complete your profile for better recommendations</li>
              <li>⭐ Rate and review workers after each service</li>
              <li>🔐 Enable two-step verification for added security</li>
            </ul>

            <p style="font-size: 16px;">
              If you have any questions, our support team is here to help you 24/7.
            </p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://yourplatform.com/login" style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Go to Website
              </a>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

            <p style="font-size: 14px; color: #666;">
              🔒 <strong>Security Tip:</strong> Never share your login credentials with anyone. If you receive suspicious emails, report them to <a href="mailto:support@yourplatform.com" style="color: #28a745; text-decoration: none;">support@yourplatform.com</a>.
            </p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://facebook.com/yourplatform" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/24/1384/1384005.png" alt="Facebook" /></a>
              <a href="https://twitter.com/yourplatform" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/24/733/733579.png" alt="Twitter" /></a>
              <a href="https://instagram.com/yourplatform" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/24/1384/1384015.png" alt="Instagram" /></a>
            </div>
          </div>

          <!-- Footer -->
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

const sendPasswordChangeEmail = async (to, name) => {
  const mailOptions = {
    from: `"WorkBuddy" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔐 Your Password Has Been Changed Successfully",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f8fa; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background-color: #1F2937; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Password Updated</h1>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Hi ${name},</p>

            <p style="font-size: 15px;">
              We wanted to let you know that your account password was successfully changed on <strong>${new Date().toLocaleString()}</strong>.
            </p>

            <p style="font-size: 15px;">
              If you made this change, no further action is needed. If you didn't, please reset your password immediately or contact our support team.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://yourplatform.com/login" style="background-color: #1F2937; color: white; padding: 12px 25px; text-decoration: none; border-radius: 2px; font-size: 16px;">
                Log In to Account
              </a>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

            <p style="font-size: 14px; color: #666;">
              ⚠️ <strong>Security Reminder:</strong> Never share your password. If you receive a suspicious message, contact <a href="mailto:support@yourplatform.com" style="color: #1F2937; text-decoration: none;">support@yourplatform.com</a>.
            </p>

          </div>

          <!-- Footer -->
          <div style="background-color: #f0f0f0; color: #888; padding: 15px; text-align: center; font-size: 13px;">
            <p style="margin: 0;">If you didn't request a password change, please contact us immediately.</p>
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
  sendCustomerWelcomeEmail,
  sendPasswordChangeEmail
};
