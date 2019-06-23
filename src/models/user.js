const moongose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const Task = require("../models/task");

var userSchema = new moongose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be greater than zero");
      }
    }
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Is not a valid email");
      }
    }
  },
  password: {
    type: String,
    trim: true,
    require: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error(`The password cannot contain 'password'`);
      }
    }
  },
  avatar: {
    type:Buffer
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
}, {
    timestamps : true
});

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

//Hash the plain text password before saving
userSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre("remove", async function(next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = moongose.model("User", userSchema);

module.exports = User;
