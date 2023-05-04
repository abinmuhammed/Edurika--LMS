const express = require("express");
const Router = express.Router();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const {
  search,
  searchUser,
  enableCourse,
  disableCourse,
  deleteCategory,
  AdminLogin,
  blockMentor,
  UnblockMentor,
  AddCategory,
  Getcategories,
  GetAllcourse,
  Allusers,
  Blockuser,
  Unblockuser,
  allMentors,
  CoursePercentage,
  totalCourses
} = require("../controller/adminController");
const { Route } = require("express");

// Configuration
cloudinary.config({
  cloud_name: "dqqrd09h7",
  api_key: "166674656845139",
  api_secret: "D1my1RBEWYfLKE7FSOeKGPZgPOU",
});

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 10 MB
});

Router.post("/addnewCategory", upload.single("Image"), AddCategory);
Router.get("/Getcategories", Getcategories);
Router.get("/Users", Allusers);
Router.put("/Blockuser/:id", Blockuser);
Router.put("/Unblockuser/:id", Unblockuser);
Router.put("/BlockMentor/:id", blockMentor);
Router.put("/UnblockMentor/:id", UnblockMentor);
Router.get("/Allcourse", GetAllcourse);
Router.post("/AdminLogin", AdminLogin);
Router.get("/Mentors", allMentors);
Router.delete("/Categories", deleteCategory);
Router.put("/Courses", disableCourse);
Router.put("/enable-Courses", enableCourse);
Router.get("/Search", search);
Router.get("/SearchUser", searchUser);
Router.get("/CoursePercentage", CoursePercentage);
Router.get("/totalCourses", totalCourses);

module.exports = Router;
