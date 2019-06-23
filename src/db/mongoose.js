const moongose = require("mongoose");
const connectionUrl = process.env.MONGODB_URL;

moongose.connect(connectionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify : false
});
