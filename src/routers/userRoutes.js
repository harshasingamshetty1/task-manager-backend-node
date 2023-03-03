const express = require("express");
const User = require("../models/userModel");
const auth = require("../middleware/auth.js");
const router = new express.Router();
const multer = require("multer");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  console.log(user);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.getUserByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((t) => t.token != req.token);

    await req.user.save();
    res.send("Logout Succesful!");
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send("Logout All devices Successful!");
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

// creating a new instance of multer, multer is used to upload files
const uploadAvatar = multer({
  /**
   * in real apps we will not store images on the server, we will store them on the database
   * so, if we do not provide the dest property, multer will not store the file on the server and hence we an access
   * req.file.buffer to get the file
   */
  //   dest: "avatars",
  limits: {
    // 1 MB
    fileSize: 10_00_000,
  },
  /**  fileFilter is used to filter the files, it takes a function with 3 arguments, req, file and cb
  // file is the file that is being uploaded, and originalname property gives the name of the file on the user's computer
  // cb is a callback function, it takes 2 arguments, error and a boolean, 
  cb is used to tell multer if the file is valid or not, cb is called at the end of the function
  */
  fileFilter(req, file, cb) {
    // regex to check if the file is an image, the regex should be wrapped in a forward slashes within the match method
    // $ is used to check if the file ends with the extension, \. is used to escape the dot, and the () is used to group the extensions
    // therefore, the regex will check if the file ends with .jpg, .jpeg or .png
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image with size <= 1 MB"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  uploadAvatar.single("avatar"),
  async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.status(200).send();
  },
  // error handling middleware, to override the multer error handling middleware which was had lot of unnecessary info
  // all the error handling middleware should be at the end of the route, and should have these 4 arguments
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.get("/users/me", auth, async (req, res) => {
  try {
    if (req.user) {
      res.send(req.user);
    } else {
      throw new Error("Invalid Auth");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();

  res.status(200).send();
});
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
