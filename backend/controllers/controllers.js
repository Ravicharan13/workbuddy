const Worker = require("../models/WorkerSignUp");
const Customer = require("../models/CustomerSignup");
const RefreshToken = require("../models/RefreshToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Request = require("../models/WorkerCustomerRequest")
const { v4: uuidv4 } = require("uuid");
const Message = require("../models/Message")
const updateWorkerAvailability = require("../utils/updateWorkerAvailability")
const { sendRegistrationEmail, sendCustomerWelcomeEmail, sendPasswordChangeEmail, sendResetCodeEmail, sendServiceRequestEmailToWorker } = require("../utils/mailer");

// Generate Access Token
const generateAccessToken = (user, role) => {
  return jwt.sign({ id: user._id, email: user.email, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};


// Generate Refresh Token
const generateRefreshToken = async (user) => {
  const expiresIn = new Date();
  expiresIn.setDate(expiresIn.getDate() + 7);

  const token = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });

  const refreshToken = new RefreshToken({
    token,
    userId: user._id,
    expiryDate: expiresIn,
  });

  await refreshToken.save();
  return token;
};

// controllers/authController.js

exports.getMe = async (req, res) => {
  try {
    // Ensure req.user exists (added by auth middleware)
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    res.status(200).json({
      isAuthenticated: true,
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      username: req.user.username
    });
  } catch (error) {
    console.error("Error in getMe:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



exports.refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    // Check if token exists in DB
    const tokenDoc = await RefreshToken.findOne({ token: oldRefreshToken });
    if (!tokenDoc) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Verify the refresh token
    const decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = decoded.id;

    // Try to find the user in Customer first, then Worker
    let user = await Customer.findById(userId);
    let role = "customer";

    if (!user) {
      user = await Worker.findById(userId);
      role = "worker";
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    console.log("user:",user)

    // ✅ Generate new access and refresh tokens
    const newAccessToken = generateAccessToken(user, role);
    const newRefreshToken = await generateRefreshToken(user, role);

    console.log("atokens:",newAccessToken)
    console.log("rtoken:",newRefreshToken)

    // Replace old refresh token in DB
    await RefreshToken.deleteOne({ token: oldRefreshToken });

    // Set cookies
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 10 * 60 * 1000, // 10 mins
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ message: "Token refreshed" });
  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};


// Worker Register
exports.register = async (req, res) => {
  const { email, firstname, lastname, username, password, services } = req.body;

  try {
    const userExists = await Worker.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Worker.create({
      email,
      firstname,
      lastname,
      username,
      password: hashedPassword,
      services: Array.isArray(services) ? services : [],
    });

    await sendRegistrationEmail(email, firstname);

    res.status(201).json({
      message: "User registered successfully",
      userType: "worker", // 👈 Add this
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        services: user.services
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Worker Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const worker = await Worker.findOne({ email });
    if (!worker) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, worker.password);
    if (!isMatch) return res.status(400).json({ message: "Password Incorrect" });

    const accessToken = generateAccessToken(worker,"worker");
    const refreshToken = await generateRefreshToken(worker);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 30 * 60 * 1000, // 30 minutes
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

    // ✅ Send username in response
    res.json({
      message: "Login Successfull!"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.workers=async (req,res)=>
{
  try
  {
      const workers= await Worker.find();
      res.send(workers);
  }catch(e)
  {
    res.send(e.message).status(500);
  }
}

// GETTING ALL WORKERS DETAILS
exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().select("-password"); // exclude password
    res.status(200).json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Worker Profile
exports.getWorkerProfile = async (req, res) => {
  try {
    const workerId = req.user.id;

    const worker = await Worker.findById(workerId).select("-password");
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json(worker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Worker Profile
exports.updateWorkerProfile = async (req, res) => {
  try {
    const workerId = req.user.id;
    const updates = req.body;

    const allowedFields = ["services", "skills", "phone", "location"];
    const filteredUpdates = {};

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    const updatedWorker = await Worker.findByIdAndUpdate(
      workerId,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedWorker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.json({ message: "Profile updated successfully", worker: updatedWorker });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Worker Profile Page API's
// Get All Data Worker
// GET /api/worker/profile
exports.getWorkerProfile = async (req, res) => {
  try {
    const user = await Worker.findById(req.user.id).select('-__v');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/worker/update-avatar
exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updated = await Worker.findByIdAndUpdate(req.user.id, { avatar }, { new: true });
    res.json({message:"Avatar updated successfully"});
  } catch (err) {
    res.status(500).json({ message: 'Avatar update failed' });
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      dob,
      phone,
      location,
      state,
      city,
      gender,
      description
    } = req.body;

    // Check if all fields are filled in
    const allFieldsPresent = [
      firstname,
      lastname,
      dob,
      phone,
      location,
      state,
      city,
      gender,
      description
    ].every(field => field && field.toString().trim() !== "");

    const profileUpdateStatus = allFieldsPresent;

    const updated = await Worker.findByIdAndUpdate(
      req.user.id,
      {
        firstname,
        lastname,
        dob,
        phone,
        location,
        state,
        city,
        gender,
        description,
        profileUpdateStatus // ✅ status based on field completeness
      },
      { new: true }
    );

    res.json({ message: "Updated Successfully!" });
  } catch (err) {
    console.error("Worker update error:", err);
    return res.status(500).json({ message: 'Failed to update info' });
  }
};



// PATCH /api/worker/add-service
exports.addService = async (req, res) => {
  try {
    const { name } = req.body;
    const workerId = req.user.id; // from JWT middleware

    if (!name) {
      return res.status(400).json({ message: "Service name is required" });
    }

    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    // Add new service
    worker.services.push({ name }); // Mongoose will auto-create _id

    await worker.save();

    const newService = worker.services[worker.services.length - 1];
    res.status(201).json(newService); // Send only the new service added
  } catch (error) {
    console.error("Add service error:", error);
    res.status(500).json({ message: "Server error while adding service" });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const workerId = req.user.id;
    const { serviceId } = req.params;

    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    // Filter out the service by _id
    worker.services = worker.services.filter(
      (s) => s._id.toString() !== serviceId
    );

    await worker.save();

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ message: "Server error while deleting service" });
  }
};


// DELETE all services for the authenticated worker
exports.deleteAllServices = async (req, res) => {
  try {
    const workerId = req.user.id; // Assuming worker is authenticated and ID is attached via middleware

    const updatedWorker = await Worker.findByIdAndUpdate(
      workerId,
      { services: [] },
      { new: true }
    );

    if (!updatedWorker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({ message: "All services deleted", services: updatedWorker.services });
  } catch (error) {
    console.error("Delete all services error:", error);
    res.status(500).json({ message: "Server error while deleting all services" });
  }
};


exports.workerChangePassword = async (req, res) => {

  try {
  const { currentPassword, newPassword } = req.body;
  const workerId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    const isMatch = await bcrypt.compare(currentPassword, worker.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    worker.password = hashedNewPassword;
    await worker.save();

    await sendPasswordChangeEmail(worker.email, worker.firstname);


    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
};









// Send Reset Code (Worker)
exports.sendResetCodeWorker = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await Worker.findOne({ email });
    if (!user) return res.status(404).json({ message: "User with this email does not exist!" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetCode = code;
    user.resetCodeExpires = expires;
    await user.save();

    await sendResetCodeEmail(user.email,user.firstname,code)

    res.json({ message: "Reset code sent to your email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// worker resetcode verify
exports.verifyResetCodeWorker = async (req, res) => {
  try {
    const { email, code } = req.body;

    
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const user = await Worker.findOne({ email });
    if (!user || !user.resetCode) {
      return res.status(404).json({ message: 'No reset code found. Please request a new one.' });
    }

    if (user.resetCode !== code) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    if (Date.now() > user.resetCodeExpires) {
      return res.status(400).json({ message: 'Reset code has expired' });
    }

  
    user.resetCodeVerified = true;
    await user.save();

    return res.status(200).json({ message: 'Code verified successfully' });
  } catch (error) {
    console.error('Verify Code Error:', error.message);
    return res.status(500).json({ message: 'Something went wrong. Try again.' });
  }
};


// worker reset password
exports.resetPasswordWorker = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Input validation
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    // Find user
    const user = await Worker.findOne({ email });
    if (!user || !user.resetCodeVerified) {
      return res.status(400).json({ message: 'Unauthorized or invalid reset attempt' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset flags
    user.password = hashedPassword;
    user.resetCode = null;
    user.resetCodeExpires = null;
    user.resetCodeVerified = false;
    await user.save();

    await sendPasswordChangeEmail(user.email,user.firstname)

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
};













// Customer Registration
exports.customerRegister = async (req, res) => {
  const { email, firstname, lastname, username, password } = req.body;

  try {
    const userExists = await Customer.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sendCustomerWelcomeEmail(email, firstname);

    const newCustomer = await Customer.create({
      email,
      firstname,
      lastname,
      username,
      password: hashedPassword
    });


    res.status(201).json({ message: "Customer registered successfully" });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


// Customer Login
exports.customerLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password incorrect" });
    }

    // Generate token
     const accessToken = generateAccessToken(customer,"customer");
     const refreshToken = await generateRefreshToken(customer)

     res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 30 minutes
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });


    res.status(200).json({
      message: "Login successful",
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getRequireInfo = async (req, res) => {
  try {
    const { role, id } = req.user; 

    let user;
    if (role === "customer") {
      user = await Customer.findById(id).select("username email role profileUpdateStatus");
    } else if (role === "worker") {
      user = await Worker.findById(id).select("username email role profileUpdateStatus");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("getRequireInfo error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// CUSTOMER PROFILE UPDATE
exports.updateCustomerProfile = async (req, res) => {
  try {
    const custId = req.user.id;
    const updates = req.body;

    const allowedFields = ["phone", "location"];
    const filteredUpdates = {};

    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    const updatedCustomer = await Customer.findByIdAndUpdate(
      custId,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Profile updated successfully", customer: updatedCustomer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Customer getting data
exports.getCustomerProfile = async (req, res) => {
  try {
    const user = await Customer.findById(req.user.id).select('-__v');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/customer/update-avatar
exports.custUpdateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updated = await Customer.findByIdAndUpdate(req.user.id, { avatar }, { new: true });
    res.json({message:"Avatar updated successfully"});
  } catch (err) {
    res.status(500).json({ message: 'Avatar update failed' });
  }
};

exports.custUpdateInfo = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      dob,
      phone,
      location,
      state,
      city,
      gender
    } = req.body;

    // Check if all fields are non-empty for setting profileUpdateStatus
    const allFieldsPresent = [firstname, lastname, dob, phone, location, state, city, gender]
      .every(field => field && field.toString().trim() !== "");

    const profileUpdateStatus = allFieldsPresent;

    const updated = await Customer.findByIdAndUpdate(
      req.user.id,
      {
        firstname,
        lastname,
        dob,
        phone,
        location,
        state,
        city,
        gender,
        profileUpdateStatus // ← update status based on completeness
      },
      { new: true }
    );

    res.json({ message: "Updated Successfully!" });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ message: 'Failed to update info' });
  }
};

// Change password for customer user
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const customerId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: 'Worker not found' });

    const isMatch = await bcrypt.compare(currentPassword, customer.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    customer.password = hashedNewPassword;
    await customer.save();

    await sendPasswordChangeEmail(customer.email, customer.firstname);


    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
};

exports.sendResetCodeCustomer = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await Customer.findOne({ email });
    if (!user) return res.status(404).json({ message: "User with this email does not exist!" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetCode = code;
    user.resetCodeExpires = expires;
    await user.save();

    await sendResetCodeEmail(user.email, user.firstname, code);

    res.json({ message: "Reset code sent to your email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyResetCodeCustomer = async (req, res) => {
  try {
    const { email, code } = req.body;

    
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const user = await Customer.findOne({ email });
    if (!user || !user.resetCode) {
      return res.status(404).json({ message: 'No reset code found. Please request a new one.' });
    }

    if (user.resetCode !== code) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    if (Date.now() > user.resetCodeExpires) {
      return res.status(400).json({ message: 'Reset code has expired' });
    }

  
    user.resetCodeVerified = true;
    await user.save();

    return res.status(200).json({ message: 'Code verified successfully' });
  } catch (error) {
    console.error('Verify Code Error:', error.message);
    return res.status(500).json({ message: 'Something went wrong. Try again.' });
  }
};


exports.resetPasswordCustomer = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Input validation
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    // Find user
    const user = await Customer.findOne({ email });
    if (!user || !user.resetCodeVerified) {
      return res.status(400).json({ message: 'Unauthorized or invalid reset attempt' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset flags
    user.password = hashedPassword;
    user.resetCode = null;
    user.resetCodeExpires = null;
    user.resetCodeVerified = false;
    await user.save();

    await sendPasswordChangeEmail(user.email,user.firstname);

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
};

// Get Customer Data
exports.getCustomerData = async (req,res) => {
  const {email} = req.body;
  try{
    const user = await Customer.findOne({email});
    if (!user) return res.status(400).json({message:"Invalid Email Address!"})
    return res.json(user)
  }catch(err){
    res.status(500).json({message:err.message})
  }
}

















// CUSTOMER AND WORKER SERVICE REQUEST APIS
// CUSTOMER-WORKER REQUEST API
exports.getCustWorkReq = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Missing request body" });
    }

    const { customerEmail, workerEmail, serviceWanted, customerLocation, scheduleDate, timeSlot   } = req.body;
    console.log("Received req.body:", req.body);

    if (!customerEmail || !workerEmail || !serviceWanted || !customerLocation) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const customerUser = await Customer.findOne({ email: customerEmail });
    if (!customerUser) return res.status(400).json({ message: "Customer Email not exist!" });

    const workerUser = await Worker.findOne({ email: workerEmail });
    if (!workerUser) return res.status(400).json({ message: "Worker Email not exist!" });

    const newRequest = new Request({
      customerEmail,
      customerFirstName: customerUser.firstname,
      customerLastName: customerUser.lastname,
      customerPhoneNumber: customerUser.phone,
      customerLocation,
      serviceWanted,
      workerEmail,
      workerFirstName: workerUser.firstname,
      workerLastName: workerUser.lastname,
      workerPhoneNumber: workerUser.phone,
      workerLocation: workerUser.city,
      customerAvatar: customerUser.avatar,
      workerAvatar: workerUser.avatar,
      scheduleDate: new Date(scheduleDate),
      timeSlot
    });

    await newRequest.save();
    await sendServiceRequestEmailToWorker({
      workerName: workerUser.firstname,
      workerEmail: workerEmail,
      customerName: customerUser.firstname,
      customerEmail: customerEmail,
      customerPhone: customerUser.phone,
      customerLocation: customerLocation,
      serviceWanted: serviceWanted,
      scheduleDate: scheduleDate,
      timeSlot: timeSlot
    });

    return res.status(201).json({ message: "Request sent successfully", data: newRequest });

  } catch (err) {
    console.error("Error sending request:", err);
    return res.status(500).json({ message: err.message });
  }
};



exports.getAll=async(req,res)=>{
  try{
    const request = await Request.find()
    return res.status(200).json(request)
  }catch(err){
    return res.status(500).json({message:err.message})
  }
}

// Get Particular Worker Records from Request Table

exports.getAllByWork=async (req, res) => {
  try {
    const workerEmail = req.user.email; 
    console.log(workerEmail)

    const requests = await Request.find({ workerEmail });
    console.log({requests})

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.getAllByCust=async (req, res) => {
  try {
    const customerEmail = req.user.email; 
    console.log(customerEmail)

    const requests = await Request.find({ customerEmail });
    console.log({requests})

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.customerCancelRequest = async (req, res) => {
  try{
    const { id } = req.params;
  console.log(id)

  const request = await Request.findById(id);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  if (request.workerStatus === "pending") {
    request.workerStatus = "cancelled";
    await request.save();
    return res.json({success: true, message: "Request cancelled Successfull!" });
  }
  return res.status(400).json({ message: "Cannot cancel — already processed or invalid state." });
}
  catch(err){
    return res.status(500).json({message:err.message})
  }

};



exports.getChatRoomId = async (req, res) => {
  const { customerId, workerId } = req.params;

  try {
    const request = await Request.findOne({
      customerId,
      workerId,
      workerStatus: "accepted",
    });

    if (!request || !request.chatRoomId) {
      return res.status(403).json({ canChat: false });
    }

    res.status(200).json({
      canChat: true,
      chatRoomId: request.chatRoomId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getChart = async (req, res) => {
  try {
    console.log("getChart",req.params.chatRoomId)
    const messages = await Message.find({ chatRoomId: req.params.chatRoomId }).sort({ timestamp: 1 });
    console.log("message:",messages)
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};


exports.getChatMessages = async (req, res) => {
  try {
    const email = req.user.email;
    const role = req.user.role;

    const filter = role === "worker"
      ? { workerEmail: email, workerStatus: { $in: ["accepted", "completed"] } }
      : { customerEmail: email, workerStatus: { $in: ["accepted", "completed"] } };

    const requests = await Request.find(filter).sort({ requestSentAt: -1 });

    const uniqueChatsMap = new Map();

    for (const req of requests) {
      const key = role === "worker" ? req.customerEmail : req.workerEmail;

      if (!uniqueChatsMap.has(key)) {
        // Fetch last message in this chat room
        const lastMsg = await Message.findOne({ chatRoomId: req.chatRoomId })
          .sort({ createdAt: -1 })
          .select("message createdAt");

        uniqueChatsMap.set(key, {
          chatRoomId: req.chatRoomId,
          name: role === "worker"
            ? `${req.customerFirstName} ${req.customerLastName}`
            : `${req.workerFirstName} ${req.workerLastName}`,
          location: role === "worker" ? req.customerLocation : req.workerLocation,
          avatar: role === "worker" ? req.customerAvatar : req.workerAvatar,
          lastMessage: lastMsg?.message || "",
          lastMessageAt: lastMsg?.createdAt || null,
        });
      }
    }

    res.json(Array.from(uniqueChatsMap.values()));
  } catch (err) {
    console.error("❌ Chat Fetch Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.acceptRequest = async (req, res) => {
  try {
    const { requestId, workerStatus, workerReason } = req.body;
    const workerId = req.user.id;

    if (!requestId || !workerStatus) {
      return res.status(400).json({ message: "Request ID and workerStatus are required" });
    }

    if (workerStatus === "rejected" && !workerReason) {
      return res.status(400).json({ message: "workerReason is required when status is rejected" });
    }

    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const updateFields = {
      workerStatus,
      workerId: worker._id,
      workerEmail: worker.email,
      workerFirstName: worker.firstname,
      workerLastName: worker.lastname,
    };

    // ✅ Generate or reuse chatRoomId only if accepted or completed
    if (workerStatus === "accepted" || workerStatus === "completed") {
      const existingChat = await Request.findOne({
        customerEmail: request.customerEmail,
        workerEmail: worker.email,
        chatRoomId: { $ne: null },
      }).sort({ requestSentAt: -1 });

      updateFields.chatRoomId = existingChat
        ? existingChat.chatRoomId
        : uuidv4();
    }

    if (workerStatus === "rejected") {
      updateFields.rejectReason = workerReason;
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      updateFields,
      { new: true }
    );

    await updateWorkerAvailability(workerId);

    const workerName = `${worker.firstname} ${worker.lastname}`;

    // ✅ Safely send email for accepted request
    if (workerStatus === "accepted") {
      try {
        await sendWorkerAcceptedEmail({
          customerName: request.customerFirstName,
          customerEmail: request.customerEmail,
          workerName,
          serviceWanted: request.serviceWanted,
          scheduleDate: request.scheduleDate,
          timeSlot: request.timeSlot,
          workerEmail: worker.email,
          workerPhone: worker.phoneNumber, // ensure `phoneNumber` is correct field
        });
      } catch (mailErr) {
        console.error("Failed to send accepted email:", mailErr.message);
      }
    }

    // ✅ Safely send email for rejected request
    if (workerStatus === "rejected") {
      try {
        await sendWorkerRejectedEmail({
          customerName: request.customerFirstName,
          customerEmail: request.customerEmail,
          workerName,
          serviceWanted: request.serviceWanted,
          rejectReason: workerReason,
        });
      } catch (mailErr) {
        console.error("Failed to send rejected email:", mailErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: `Request ${workerStatus} successfully`,
      data: updatedRequest,
    });
  } catch (err) {
    console.error("Error updating request status:", err);
    res.status(500).json({ error: err.message });
  }
};



exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    // Clear the cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    // Delete the token from DB
    if (token) {
      await RefreshToken.deleteOne({ token });
    }

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};
