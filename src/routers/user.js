const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const errorHandler = require('../middleware/error');
const multer = require("multer");
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email,user.name);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.log('errror ->>>>>>',error)
    res.status(400).send(error);

  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = []; //req.user.tokens.filter(token=> token.token !== req.token);

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));

    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancellationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please send a image file!"));
    }
    cb(undefined, true);
  }
});

router.post("/users/me/avatar",auth, upload.single("avatar"), async (req, res) => {

  const buffer = await sharp(req.file.buffer).resize({width : 250 , height:250}).png().toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.send();
},errorHandler);

router.delete("/users/me/avatar",auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save();
  res.send();
},errorHandler);

router.get('/users/:id/avatar',async (req,res)=>{
  try {
   const user = await User.findById(req.params.id);
   if(user || user.avatar){
     res.set('Content-Type','image/jpg');
    res.send(user.avatar);
   }
  } catch (error) {
    res.status(400).send(error);
  }
})

module.exports = router;
