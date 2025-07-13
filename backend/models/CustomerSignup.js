const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetCode: { type: String },
  resetCodeExpires: { type: Date },
   resetCodeVerified : {type: Boolean},
  phone: { type: String },           
  location: { type: String },     
  role: {
  type: String,
  default: "customer",
  enum: ["customer"],
},
dob: { type: Date },

  gender: {
    type: String,
    enum: ['male', 'female'],
    required: false
  },
  avatar: {
    type: String,
    default: function () {
      // `this` refers to the document being created
      if (this.gender === 'female') {
        return 'https://res.cloudinary.com/dquha58yu/image/upload/v1751697562/female_m1dwf1.png';
      } else {
        return 'https://res.cloudinary.com/dquha58yu/image/upload/v1751697248/307ce493-b254-4b2d-8ba4-d12c080d6651_pty54f.jpg';
      }
    }
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model("CustomerSignUp", customerSchema);
