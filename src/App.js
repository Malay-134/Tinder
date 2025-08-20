const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    // console.log(hashPassword);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error", error);
    console.log(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Email");
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    // console.log(password)
    // console.log("User :" , user.password)
    if (isPassEqual) {
      const token = jwt.sign(
        { _id: user._id },
        "h8*wbh$@ef#kh87kk*$#&jkKB3FNn"
      );
      res.cookie("token", token);
      return res.send("Login success");
    } else {
      throw new Error("Invalid Password");
    }
  } catch (error) {
    res.status(400).send("Error", error.message);
    // console.log(error.message);
  }
});

app.get("/profile", userAuth ,  async (req, res) => {
  try {
    const user = req.user;
    console.log(user); 
    res.send(user);
  } catch (error) {
    res.status(400).send("Error", error.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.find({ email: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

connectDb()
  .then(() => {
    console.log("Connected to Database");
    app.listen(3000, () => {
      console.log("Server started successfully");
    });
  })
  .catch((err) => console.log(err));
