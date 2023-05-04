const express = require("express");

const router = express.Router();
const {
  StudentSignup,
  StudentLogin,
  privateApi,
  getallCourse,
  findUser,
  searchMentor
  
 

} = require("../controller/Usercontroller");

const { submitMail,resetPassword,conformPass}=require('../controller/forgetMailController')
const { validateTokenforStudents } = require("../middlewares/validateToken");
const { Notification,getNotification,notificationCount,setIsVisitedTrue,getMentorNotification }=require('../controller/notificationController')

router.post("/SignupAsStudent", StudentSignup);
router.post("/LoginAsStudent", StudentLogin);
router.get("/privateApi", validateTokenforStudents, privateApi);
router.get("/getSpecificcategory/:id",getallCourse)
router.get("/user",findUser)
router.post('/forgetMail',submitMail)
router.get("/resetPassword",resetPassword)
router.post("/passwordChange",conformPass)
router.get("/searchMentor",searchMentor)

router.route('/notification')
.post(Notification)
.get(getNotification)

router.route('/Count')
.get(notificationCount)
.post(setIsVisitedTrue)

router.get("/getMentorNotification",getMentorNotification)

module.exports = router;
