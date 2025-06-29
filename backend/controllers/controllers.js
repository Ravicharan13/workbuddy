
const Worker = require("../models/WorkerSignUp");
const RefreshToken = require("../models/RefreshToken")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

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