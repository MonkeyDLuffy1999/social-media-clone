const User = require("../model/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");


//register new user
router.post("/register", async (req, res) => {
  try {
    //bcrypt hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save new user
    const newUser = await user.save();
    res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
  }
});

//login existing user
router.post("/login", async (req, res) => {
  try {
    //search user with email
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");
    
    //validate password
    const validPassword = await bcrypt.compare(req.body.password, user.password);  
    validPassword ? res.status(200).json("login success") : res.status(400).json("login failed");

    
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
