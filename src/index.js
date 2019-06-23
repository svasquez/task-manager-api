const express = require("express");

require("./db/mongoose");

const app = express();
const port = process.env.PORT;

const errorHandler = require('./middleware/error');
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const multer = require("multer");
const upload = multer({
  dest: "images",
  limits: {
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(doc|docx)$/)){
      return cb(new Error('Please upload a Word document!'))
    }

    cb(undefined,true)
  }
});

app.post("/upload", upload.single('upload'), (req, res) => {
  res.send();
},errorHandler);

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

const jwt = require("jsonwebtoken");

const myFunction = async () => {
  //const token = jwt.sign({},'');
};

myFunction();
