const mongoose = require("mongoose");
const validator = require("validator");
const bycrpt = require("bcryptjs");
const Bookmark = require("./bookmark");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "We must required your username"],
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "A email must required"],
    validate: [validator.isEmail, "plz provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Plz provide password"],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "password doesn't match",
    },
    select: false,
  },
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bycrpt.compare(candidatePassword, userPassword);
};
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bycrpt.hash(this.password, 14);
  this.confirmPassword = undefined;
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
