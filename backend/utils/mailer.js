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
    subject: "Your Password Has Been Changed Successfully",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f8fa; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background-color: #1F2937; color: white; padding: 18px; text-align: center;">
            <h1 style="margin: 0;">Password Changed</h1>
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

const sendResetCodeEmail = async (to, name, code) => {
  const mailOptions = {
    from: `"WorkBuddy" <${process.env.EMAIL_USER}>`,
    to,
    subject: "WorkBuddy Password Reset Code",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f8fa; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background-color: #1F2937; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Reset Your Password</h1>
            </div>

            <!-- Body -->
            <div style="padding: 30px; color: #333;">
              <p style="font-size: 16px;">Hi ${name || "there"},</p>
              <p style="font-size: 15px;">We received a request to reset your password. Use the code below to proceed:</p>
              <div style="text-align: center; margin: 25px 0;">
                <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #1F2937;">${code}</p>
                <p style="font-size: 14px; color: #555;">This code is valid for 15 minutes.</p>
              </div>
              <p style="font-size: 15px;">If you didn’t request this, you can safely ignore this email.</p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://yourplatform.com/forgot-password" style="background-color: #1F2937; color: white; padding: 12px 25px; text-decoration: none; border-radius: 2px; font-size: 15px;">
                  Check to your Account
                </a>
              </div>

              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

              <p style="font-size: 14px; color: #666;">
                If you have any questions, reach out to <a href="mailto:support@yourplatform.com" style="color: #1F2937; text-decoration: none;">support@yourplatform.com</a>.
              </p>

             </div>

            <!-- Footer -->
            <div style="background-color: #f0f0f0; color: #888; padding: 15px; text-align: center; font-size: 13px;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} WorkBuddy. All rights reserved.</p>
            </div>
          </div>
        </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

const sendServiceRequestEmailToWorker = async ({
  workerName,
  workerEmail,
  customerName,
  customerEmail,
  customerPhone,
  customerLocation,
  serviceWanted,
  scheduleDate,
  timeSlot,
}) => {
  const mailOptions = {
    from: `"WorkBuddy" <${process.env.EMAIL_USER}>`,
    to: workerEmail,
    subject: "📩 New Service Request Received!",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f8fa; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background-color: #1F2937; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">New Service Request</h1>
          </div>
          
          <!-- Body -->
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Hi ${workerName},</p>

            <p style="font-size: 15px;">
              A customer has just submitted a new service request. This is a great opportunity to showcase your skills and build a strong reputation on our platform.
            </p>

            <p style="font-size: 15px;">You have a new request from <strong>${customerName}</strong>. Here are the details:</p>

            <ul style="font-size: 15px; padding-left: 20px; line-height: 1.8;">
              <li><strong>📧 Customer Email:</strong> ${customerEmail}</li>
              <li><strong>📞 Customer Phone:</strong> ${customerPhone}</li>
              <li><strong>🛠️ Service Requested:</strong> ${serviceWanted}</li>
              <li><strong>📍 Location:</strong> ${customerLocation}</li>
              <li><strong>📅 Scheduled Date:</strong> ${scheduleDate}</li>
              <li><strong>⏰ Time Slot:</strong> ${timeSlot}</li>
            </ul>

            <p style="font-size: 15px;">
              Please make sure to check your dashboard and respond to the request as soon as possible. Timely communication and professionalism help you gain better reviews and repeat customers.
            </p>

            <p style="font-size: 15px;">
              If you're available and ready to take up the task, head to your dashboard, view the request in full, and accept it to proceed. Otherwise, you can decline the request so it may be reassigned to another professional.
            </p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://yourplatform.com/login" style="background-color: #1F2937; color: white; padding: 12px 25px; text-decoration: none; border-radius: 2px; font-size: 16px;">
                View Request in Dashboard
              </a>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

            <p style="font-size: 14px; color: #666;">
              📌 <strong>Pro Tip:</strong> A quick and polite response improves your chances of receiving 5-star reviews and getting preferred by future customers.
            </p>

            <p style="font-size: 14px; color: #666;">
              If you have questions or concerns about this request, feel free to reach out to our support team anytime.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0f0f0; color: #888; padding: 15px; text-align: center; font-size: 13px;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Your Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

const sendWorkerAcceptedEmail = async ({
  customerName,
  customerEmail,
  workerName,
  serviceWanted,
  scheduleDate,
  timeSlot,
  workerEmail,
  workerPhone
}) => {
  const mailOptions = {
    from: `"WorkBuddy" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Your Service Request Has Been Accepted`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f8fa; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background-color: #1F2937; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Good News!</h1>
          </div>

          <!-- Main Content -->
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Hi ${customerName},</p>
            <p style="font-size: 16px;">Your service request has been <strong>accepted</strong> by <strong>${workerName}</strong>.</p>

            <p style="font-size: 15px;">Here are the request and worker details:</p>
            <ul style="font-size: 15px; padding-left: 20px; line-height: 1.8;">
              <li><strong>Service:</strong> ${serviceWanted}</li>
              <li><strong>Scheduled Date:</strong> ${scheduleDate}</li>
              <li><strong>Time Slot:</strong> ${timeSlot}</li>
              <li><strong>Worker Name:</strong> ${workerName}</li>
              <li><strong>Worker Email:</strong> ${workerEmail}</li>
              <li><strong>Worker Phone:</strong> ${workerPhone}</li>
            </ul>

            <p style="font-size: 15px;">You can now chat with the worker directly via your dashboard and coordinate any specifics if needed.</p>

            <p style="font-size: 15px; margin-top: 20px; background-color: #f1f5f9; padding: 10px; border-left: 4px solid #1F2937;">
              📌 <strong>Reminder:</strong> Be available at the scheduled time and location to ensure a smooth service experience.
            </p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://yourplatform.com/login" style="background-color: #1F2937; color: white; padding: 12px 25px; text-decoration: none; border-radius: 2px; font-size: 16px;">
                View Request
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0f0f0; color: #888; padding: 15px; text-align: center; font-size: 13px;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Your Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

const sendWorkerRejectedEmail = async ({ customerName, customerEmail, workerName, serviceWanted, rejectReason }) => {
  const mailOptions = {
    from: `"WorkBuddy" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: " Your Service Request Was Rejected",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #fef2f2; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background-color: #1F2937; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Request Rejected</h1>
          </div>

          <!-- Body -->
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Hi ${customerName},</p>
            <p style="font-size: 16px;">
              We’re sorry to inform you that <strong>${workerName}</strong> has <strong>rejected</strong> your service request.
            </p>

            <p style="font-size: 15px;">Reason provided:</p>
            <blockquote style="font-size: 15px; font-style: italic; color: #dc2626; margin: 20px 0;">"${rejectReason}"</blockquote>

            <ul style="font-size: 15px; padding-left: 20px; line-height: 1.8;">
              <li><strong>Service Requested:</strong> ${serviceWanted}</li>
              <li><strong>Request Status:</strong> Rejected</li>
              <li><strong>Requested Worker:</strong> ${workerName}</li>
            </ul>

            <p style="font-size: 15px;">
              Don't worry — you can quickly find other trusted professionals on our platform who are ready to help.
            </p>

            <p style="font-size: 15px;">
              We recommend:
            </p>
            <ul style="font-size: 15px; padding-left: 20px;">
              <li>🔍 Browsing available workers by service and location</li>
              <li>📝 Reviewing ratings and profiles before sending a request</li>
              <li>🚀 Choosing flexible time slots to improve acceptance chances</li>
            </ul>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://yourplatform.com/browse" style="background-color: #1F2937; color: white; padding: 12px 25px; text-decoration: none; border-radius: 2px; font-size: 16px;">
                Find Another Worker
              </a>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

            <p style="font-size: 14px; color: #666;">
              🤝 <strong>Need Help?</strong> Our support team is available 24/7. Reach us at 
              <a href="mailto:support@yourplatform.com" style="color: #1F2937; text-decoration: none;">support@yourplatform.com</a>.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0f0f0; color: #888; padding: 15px; text-align: center; font-size: 13px;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Your Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

const sendAutoCancelledEmailToCustomer = async ({ customerName, customerEmail, serviceWanted, scheduleDate, timeSlot }) => {
  const mailOptions = {
    from: `"WorkBuddy" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: " Your Request Was Automatically Cancelled",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #fff0f0; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 2px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background-color: #1F2937; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Request Cancelled</h2>
          </div>

          <!-- Body -->
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Hi ${customerName},</p>

            <p style="font-size: 16px;">
              We're sorry, but your service request was <strong>automatically cancelled</strong> because the assigned worker did not respond in time before the scheduled service period.
            </p>

            <ul style="font-size: 15px; padding-left: 20px; line-height: 1.8;">
              <li><strong>Service:</strong> ${serviceWanted}</li>
              <li><strong>Scheduled Date:</strong> ${scheduleDate}</li>
              <li><strong>Time Slot:</strong> ${timeSlot}</li>
            </ul>

            <p style="font-size: 15px;">You can still find another available worker and rebook the service.</p>

            <div style="text-align: center; margin-top: 25px;">
              <a href="https://yourplatform.com/browse" style="background-color: #1F2937; color: white; padding: 10px 20px; border-radius: 2px; text-decoration: none;">
                Find Another Worker
              </a>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

            <p style="font-size: 14px; color: #666;">
              If you need help or want to report this issue, please contact our support team at 
              <a href="mailto:support@yourplatform.com" style="color: #1F2937; text-decoration: none;">support@yourplatform.com</a>.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0f0f0; color: #888; padding: 15px; text-align: center; font-size: 13px;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Your Platform. All rights reserved.</p>
          </div>

        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};


const sendAutoCompletedEmailToCustomer = async ({ customerEmail, customerName, serviceWanted, scheduleDate, timeSlot }) => {
  const mailOptions = {
    from: `"WorkBuddy" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: " Your Request Has Been Marked as Completed",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f0fdf4; padding: 30px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 2px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background-color: #1F2937; color: white; padding: 20px; text-align: center;">
      <h2 style="margin: 0;">Request Completed</h2>
    </div>

    <!-- Body -->
    <div style="padding: 30px; color: #333;">
      <p style="font-size: 16px;">Hi ${customerName},</p>
      <p style="font-size: 15px;">
        Your service request has been <strong>automatically marked as completed</strong> based on the scheduled date and time.
      </p>

      <ul style="font-size: 15px; padding-left: 20px; line-height: 1.8;">
        <li><strong>Service:</strong> ${serviceWanted}</li>
        <li><strong>Scheduled Date:</strong> ${scheduleDate}</li>
        <li><strong>Time Slot:</strong> ${timeSlot}</li>
      </ul>

      <p style="font-size: 15px;">
        If your service was successfully completed, you don’t need to do anything. However, if there was an issue, please report it through your dashboard or contact support.
      </p>

      <div style="text-align: center; margin-top: 25px;">
        <a href="https://yourplatform.com/requests" style="background-color: #1F2937; color: white; padding: 10px 20px; border-radius: 2px; text-decoration: none;">
          View Details
        </a>
      </div>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 14px; color: #666;">
        If you have any concerns or need assistance, reach out to us at 
        <a href="mailto:support@yourplatform.com" style="color: #1F2937; text-decoration: none;">support@yourplatform.com</a>.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f0f0f0; color: #888; padding: 15px; text-align: center; font-size: 13px;">
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
  sendPasswordChangeEmail,
  sendResetCodeEmail,
  sendServiceRequestEmailToWorker,
  sendWorkerAcceptedEmail,
  sendWorkerRejectedEmail,
  sendAutoCancelledEmailToCustomer,
  sendAutoCompletedEmailToCustomer
};
