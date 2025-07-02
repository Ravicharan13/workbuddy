const Worker = require("../models/WorkerSignUp");
const Customer = require("../models/CustomerSignUp");
const RefreshToken = require("../models/RefreshToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Request = require("../models/WorkerCustomerRequest")
const { v4: uuidv4 } = require("uuid");

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
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

    const accessToken = generateAccessToken(worker);
    const refreshToken = await generateRefreshToken(worker);

    // ✅ Send username in response
    res.json({
      accessToken,
      refreshToken,
      username: worker.username
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



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

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"WorkBuddy" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'WorkBuddy: Password Reset Code',
      html: `<p>Your reset code is: <b>${code}</b></p><p>This code will expire in 15 minutes.</p>`,
    });

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
     const accessToken = generateAccessToken(customer);
     const refreshToken = await generateRefreshToken(customer)

    res.status(200).json({
      message: "Login successful",
      accessToken,refreshToken,
      username:customer.username
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
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

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"WorkBuddy" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'WorkBuddy: Password Reset Code',
      html: `<p>Your reset code is: <b>${code}</b></p><p>This code will expire in 15 minutes.</p>`,
    });

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
exports.getCustWorkReq= async (req, res) => {
  try {
    const {
      customerEmail,
      customerFirstName,
      customerLastName,
      phoneNumber,
      location,
      serviceWanted,
      workerEmail,
      workerFirstName,
      workerLastName
    } = req.body;
    console.log(req.body)
    // Basic validation
    if (!customerEmail || !customerFirstName || !customerLastName || !phoneNumber || !location || !serviceWanted || !workerEmail || !workerFirstName || !workerLastName) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // Create new request
    const newRequest = new Request({
      customerEmail,
      customerFirstName,
      customerLastName,
      phoneNumber,
      location,
      serviceWanted,
      workerEmail,
      workerFirstName,
      workerLastName
    });

    await newRequest.save();

    res.status(201).json({ message: "Request sent successfully", data: newRequest });
  } catch (err) {
    console.error("Error sending request:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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

























exports.acceptRequest = async (req, res) => {
  try {
    const { requestId, workerStatus, workerReason } = req.body;
    const workerId = req.user.id;
    console.log(workerStatus,workerReason)

    console.log("🆔 Request ID:", requestId);
    console.log("👷‍♂️ Worker ID:", workerId);
    console.log("📌 Status to update:", workerStatus);

    // Validate required fields
    if (!requestId || !workerStatus) {
      return res.status(400).json({ message: "Request ID and workerStatus are required" });
    }

    // Reject case: workerReason is required
    if (workerStatus === "rejected" && !workerReason) {
      return res.status(400).json({ message: "workerReason is required when status is rejected" });
    }

    // Find the worker
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Prepare update fields
    const updateFields = {
      workerStatus,
      workerId: worker._id,
      workerEmail: worker.email,
      workerName: `${worker.firstname} ${worker.lastname}`,
    };

    if (workerStatus === "accepted") {
      updateFields.chatRoomId = uuidv4();
    }

    if (workerStatus === "rejected") {
      updateFields.rejectReason = workerReason;
    }

    // Update the request
    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      updateFields,
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({
      message: `Request ${workerStatus} successfully`,
      data: updatedRequest,
    });
  } catch (err) {
    console.error("Error updating request status:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
