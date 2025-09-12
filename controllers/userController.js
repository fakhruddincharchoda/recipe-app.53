const User = require("../Model/user");
const jwt = require("jsonwebtoken");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const signup = async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  const Token = signToken(newUser._id);
  await newUser.save();
  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
      Token,
    },
  });
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new Error("Plz provide email and password"));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new Error("Incorrect password or email"));
    }
    // 3) if everything ok , send the token
    const token = signToken(user._id);
    res.status(200).json({
      status: "sucess",
      token,
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message:
        "plz provide Email and password or Your information are Incorrect",
    });
    console.log(err.message);
  }
};

const protect = async (req, res, next) => {
  let token;

  // Case 1: Token sent in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // take token after "Bearer"
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password"); // attach user to req
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // Case 2: Token sent in cookie (if you’re using cookies for auth)
  else if (req.cookies && req.cookies.jwt) {
    try {
      token = req.cookies.jwt;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // No token at all
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = {
  signup,
  login,
  protect,
};
