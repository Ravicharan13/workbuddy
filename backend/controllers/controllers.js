
const Worker = require("../models/WorkerSignUp");
const bcrypt = require("bcryptjs");

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