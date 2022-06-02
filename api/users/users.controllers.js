const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXP } = require('../../config/keys');

exports.signin = async (req, res) => {
  const payload = { // Create a session for the user after they sign up 
    // add user info that you want to acces inside the session ==> IMPORTANT(DO NOT ADD SENSATIVE INFO LIKE PASSWORD)
    _id: req.user._id,
    username: req.user.username,
    msg: "You're in SI!!!!!",
    urls: req.user.urls,
    exp: Date.now() + JWT_EXP, // session timer ==> when the timer ends end session
  };
  const token = jwt.sign(payload, JWT_SECRET); // Start payload session with its secreat Key
  res.json({ token }); // return token
};

// exports.signup = async (req, res) => {
//   try {
//     const hashedPass = await bcrypt.hash(req.body.password, 10); // 10 ==> salting 10 times
//     req.body.password = hashedPass;
//     const newUser = await User.create(req.body);
//     res.status(201).json(newUser);
//   } catch (err) {
//     res.status(500).json('Server Error');
//   }
// };

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('urls');
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json('Server Error');
  }
};

exports.signup = async (req, res) => { // Sign Up with Remember Me
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10); // 10 ==> salting 10 times
    req.body.password = hashedPass;
    const newUser = await User.create(req.body);

    const payload = { // Create a session for the user after they sign up 
      // add user info that you want to acces inside the session ==> IMPORTANT(DO NOT ADD SENSATIVE INFO LIKE PASSWORD)
      _id: newUser._id,
      username: newUser.username,
      msg: "You're in Su!!!!!",
      urls: newUser.urls,
      exp: Date.now() + JWT_EXP, // session timer ==> when the timer ends end session
    };
    const token = jwt.sign(payload, JWT_SECRET); // Start payload session with its secreat Key
    res.json({ token }); // return token
  } catch (err) {
    res.status(500).json('Server Error');
  }
};


