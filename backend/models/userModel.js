const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String , default : ""},
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, default: "GENERAL" }
  },
  { timestamps: true } 
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
