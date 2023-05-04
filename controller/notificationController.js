const { response, json } = require("express");
const asynchandler = require("express-async-handler");
const NotificationsModel = require("../Model/Notification");

const Notification = async (req, res) => {
  const { notification,userType } = req.body;
  console.log();

  console.log(notification);
  try {
    await NotificationsModel.create({
      notification,userType
    }).then((resp) => {
      console.log(resp,"created");
      res.json({ msg: resp });
    });
  } catch (error) {
    res.json({ msg: error });
  }
};

const getNotification = async (req, res) => {
  console.log("343");
  try {
    await NotificationsModel.find().then((response) => {
      console.log(response);
      res.json({ msg: response });
    });
  } catch (error) {
    res.json({ msg: error });
  }
};


const getMentorNotification=async (req,res)=>{
  try {

    await NotificationsModel.find({ userType: { $exists: true, $ne: "student" } }).then((response)=>{
      res.json({msg:response})
    
    })
  } catch (error) {
      res.json({mgs:Error})
  }
}

const notificationCount = async (req, res) => {
  try {
    await NotificationsModel.countDocuments({ isvisited: false }).then(
      (response) => {
        res.json({ msg: response });
      }
    );
  } catch (err) {
    res.json({ msg: err });
  }
};

const setIsVisitedTrue=async(req,res)=>{
    try {
        await NotificationsModel.updateMany({},{
            $set:{isvisited:true}
        }).then((resp)=>{
            res.json({msg:resp});
        })
    } catch (error) {
        res.json({msg:err})
    }
}

module.exports = {
  Notification,
  getNotification,
  notificationCount,
  setIsVisitedTrue,
  getMentorNotification
};
