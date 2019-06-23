const moongose = require("mongoose");

var taskSchema = new moongose.Schema({
  description: {
    type: String,
    trim : true,
    require : true,

  },
  completed: {
      type: Boolean,
      default : false,
  },
  owner: {
    type: moongose.Schema.Types.ObjectId,
    required : true,
    ref: 'User'
  }
}, {
  timestamps : true
});

const Task = moongose.model("Task", taskSchema);

  module.exports = Task;