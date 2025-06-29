
const Worker = require("../models/WorkerSignUp");
const RefreshToken = require("../models/RefreshToken")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// GENERATING ACCESS TOKEN
const generateAccessToken = (user) => {
    return  jwt.sign({id:user._id,email:user.email}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

// GENERATING REFRESH TOKEN
const generateRefreshToken = async (user) =>{
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate()+7);

    const token = jwt.sign({id:user._id}, process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN,
    })

    const refreshToken= new RefreshToken({
        token,
        userId:user._id,
        expiryDate:expiresIn,
    })
    await refreshToken.save();
    return token;
}

// WORKER REGISTER API
exports.register = async (req, res) => {
  const {email,firstname, lastname, username, password } = req.body;
  try {
    const userExists = await Worker.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Worker.create({email, firstname, lastname, username, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// WORKER LOGIN API
exports.login = async (req,res) => {
    const {email, password} = req.body;
    try{
        const worker = await Worker.findOne({email});
        if (!worker) return res.status(400).json({message: "Invalid Credentials"});

        const isMatch = await bcrypt.compare(password, worker.password);
        if (!isMatch) return res.status(400).json({message: "Password Incorrect"})
        
        const accessToken = generateAccessToken(worker);
        const refreshToken = await generateRefreshToken(worker)

        res.json({accessToken,refreshToken})

    }catch(err){
        res.status(500).json({message:err.message})
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

// PROFILE UPDATE
exports.updateWorkerProfile = async (req, res) => {
  try {
    const workerId = req.user.id;
    const updates = req.body;

    const allowedFields = ["service", "skills", "phone", "location"];
    const filteredUpdates = {};

    
    allowedFields.forEach(field => {
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


// Sending Reset Code for forgot password
exports.sendResetCode = async (req, res)=>{
    const {email} = req.body;
    try{
        const user = await Worker.findOne({email});
        if(!user) return res.status(404).json({message:"User not found!"})

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 15 * 60 * 1000)

        user.resetCode = code;
        user.resetCodeExpires = expires;
        await user.save();

        const transporter = nodemailer.createTransport({
            service:"Gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        })

        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to: user.email,
            subject: "Your Password Reset Code",
            html: `<p>Your reset code is: <b>${code}</b></p><p>This code will expire in 15 minutes.<.p>`,

        })
        res.json({message:"Reset code send to your email."})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}


// Verifying Reset Code for forgot password
exports.verifyResetCode = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await Worker.findOne({ email });
    console.log(user)
    if (!user || user.resetCode !== code)
      return res.status(400).json({ message: "Invalid reset code" });

    if (user.resetCodeExpires < new Date())
      return res.status(400).json({ message: "Reset code has expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
