const mongoose = require("mongoose");
const { token } = require("morgan");

const students = mongoose.Schema({
  FirstName: {
    type: String,
    required: [true, "please add the first Name"],
  },
  LastName: {
    type: String,
    required: [true, "please add the Last Name"],
  },
  Email: {
    type: String,
    required: [true, "please add the Email"],
  },
  Mobile: {
    type: String,
    required: [true, "please add the Mobile number"],
  },
  Password: {
    type: String,
    required: [true, "please add the password"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  Token: {
    type: {
      Token: {
        type: String,
      },
      Expires: {
        type: Date
      },
    }
  }

},{
  timestamps: true,
});

module.exports = mongoose.model("studentSchema", students);
