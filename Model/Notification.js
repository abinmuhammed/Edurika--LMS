const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema(
  {
    notification: {
      type: String,
      required:[true]
    },
    isvisited:{
      type:Boolean,
      default:false

    },userType:{
      type:String
    }
  },
  {
    timestamps: true,
    capped:{max:15}
  },
);


module.exports = mongoose.model("Notifiaction", NotificationSchema);
