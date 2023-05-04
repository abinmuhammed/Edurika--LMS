const express = require("express");
const router = express.Router();
// const { validateToken } = require("../middlewares/validateToken");


// multer
const multer = require("multer");
// const Joi = require("joi");
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//configure multer middleware

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // 10 MB
});

const {
  MentorSignup,
  MentorLogin,
  Mentorprofile,
  CreateCourse, 
  uploadto,
  ALlcourses,
  specificLessons,
  deleteCourse,
  deleteModule,
  findMentor
} = require("../controller/mentorController");

router.post("/signupAsMentor", MentorSignup);
router.post("/LoginasMentor", MentorLogin);

// router.get("/Mentorprofile", validateToken, Mentorprofile);

router.post("/CreateCourse",CreateCourse);



// router.post('/createcourse',createCourse)

router.post("/upload", upload.single("video"),uploadto);

router.get("/GetallCourses",ALlcourses)
router.get("/getLessons",specificLessons)
router.put("/delete/:id",deleteCourse)
router.delete('/deleteModule ',deleteModule)
router.get("/mentor",findMentor)


module.exports = router;
