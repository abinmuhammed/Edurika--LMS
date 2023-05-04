const asyncHandler = require("express-async-handler");
const Mentor = require("../Model/Mentor");
const Courses = require("../Model/CourseSChema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const cloudinary = require("cloudinary").v2;

//@desc Create new Api fopr Signup
//@route get /signupAsMentor
//@access public

const MentorSignup = asyncHandler(async (req, res) => {
  req.body;
  const { FirstName, LastName, Email, Mobile, Password } = req.body;
  if (!FirstName || !LastName || !Email || !Mobile || !Password) {
    res.status(400);
    throw new Error("all fields are mandetory !");
  }

  const MentorAvailable = await Mentor.findOne({ Email });

  if (MentorAvailable) {
    res.status(400);
    throw new Error("Email already registerd");
  }

  //hash password

  const hashPassword = await bcrypt.hash(Password, 10);

  const NewMentor = await Mentor.create({
    FirstName,
    LastName,
    Email,
    Mobile,
    Password: hashPassword,
  });
  if (NewMentor) {
    res.status(201).json({ email: NewMentor.Email });
  } else {
    res.status(400);
    throw new Error("user data is not valid");
  }

  res.send("success");
});

//@desc Create new Api fopr Login
//@route get /LoginAsMentor
//@access public
const MentorLogin = asyncHandler(async (req, res) => {

  const { Email, password } = req.body;

  const user = await Mentor.findOne({ Email });
  console.log(user);
  if (user && !user.isActive) {
   return res.status(401).json({ error: "Mentor is Blocked ..!" });
  }

  if (user && (await bcrypt.compare(password, user.Password))) {
    const payload = { firstname: user.FirstName, Email: user.Email };
    const secretToken = process.env.ACCESS_TOKEN;
    
    const accesstoken = jwt.sign(payload, secretToken, { expiresIn: "6m" });

    res
      .status(201)
      .json({ accesstoken, FirstName: user.FirstName, userID: user._id });
  } else {
  
    res.status(401).json({error:"Authentication failed...!"})
   

  }
});

//@desc Create new Api fopr Login
//@route get /LoginAsMentor
//@access private

const Mentorprofile = asyncHandler(async (req, res) => {
  res.send("private route authorised successfully");
});

//@desc Create new Api for course creation
//@route get /create- a-course
//@access public

const CreateCourse = asyncHandler(async (req, res) => {
  const { Title, Description, Author, Category, userID } = req.body;
  const Course = await Courses.create({
    Title,
    Description,
    Author,
    Category,
    userID,
  });

  if (Course) {
    res.status(201).json({ success: "success" });
  } else {
    alert("failed");
  }
});

// upload a Video to Cloudinary
//@desc Create new Api for module creation
//@route get /add- a-lesson
//@access public

const uploadto = asyncHandler(async (req, res) => {
  const cousreId = req.body.courseID;
  const moduleName = req.body.modulename;

  try {
    const base64String = req.file.buffer.toString("base64");

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${base64String}`,
      {
        public_id: moduleName,
        resource_type: "video",
        folder: "Courses",

        context: {
          course_id: cousreId,
        },
        tags: cousreId,
      }
    );
    result, "result";
    if (result) {
      console.log(result);
      const LessonUrl = result.secure_url;

      await Courses.updateOne(
        { _id: cousreId },
        {
          $push: {
            Lessons: {
              ModuleName: moduleName,
              url: LessonUrl,
              duration: result.duration,
            },
          },
        }
      )
        .then((response) => {
          res.json({ url: result.secure_url, success: "uploaded succesfully" });
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      res.json({ failed: "something went wronng ..." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while uploading the video file" });
  }
});

//@desc Create fetch all the courses
//@route get /add- a-lesson
//@access public

const ALlcourses = async (req, res) => {
  ("userID");
  "userID", req.query.userID;

  const userid = req.query.userID;

  try {
    let allCourse = await Courses.find({ userID: userid });

    res.status(200).json({ course: allCourse });
  } catch (err) {
    console.error(err, "errr");
  }
};

//@desc Create fetch all the courses
//@route get /add- a-lesson
//@access public

const specificLessons = asyncHandler(async (req, res) => {
  const courseID = req.query.courseID;
  courseID;

  try {
    // let result = await cloudinary.search
    //   .expression(`resource_type:video AND tags=${courseID}`)
    //   .sort_by("public_id", "desc")
    //   .max_results(30)
    //   .execute();

    const result = await Courses.find({ _id: courseID });
    if (result) {
      res.json({ result });
    } else {
      res.status(401);
      throw new Error("No Course Found !");
    }
  } catch (error) {
    alert(error);
    res.status(401);
    throw new error("No Course Found !");
  }
});

//@desc Create delete Coursecard
//@route get /add- a-lesson
//@access public

const deleteCourse = asyncHandler(async (req, res) => {
  const courseID = req.params.id;
  try {
    cloudinary.api
      .delete_resources_by_tag(courseID, {
        public_id: "",
        resource_type: "video",
        folder: "Courses",
        all: true,
        context: {
          course_id: courseID,
        },
        tags: courseID,
      })
      .then(async (response) => {
        await Courses.deleteOne({ _id: courseID })
          .then((response) => {
            res.status(201);
            res.json({ msg: "Course Card deleted Succesfully" });
          })
          .catch((err) => {
            throw new Error(err);
          });
      });
  } catch (error) {
    alert(error);
  }
});

//@desc  delete module
//@route get /add- a-lesson
//@access public

const deleteModule = asyncHandler(async (req, res) => {
  console.log(req.query);

  const module = req.query.module;

  const course = req.query.course;

  try {
    cloudinary.api
      .delete_resources(`Courses/${module}`, {
        resource_type: "video",
        folder: "Courses",
      })
      .then(() => {
        Courses.updateOne(
          { _id: course },
          {
            $pull: { Lessons: { ModuleName: module } },
          }
        )
          .then((response) => {
            res.json({ msg: "Succesfully deleted the Value" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
  } catch (error) {
    res.status(401);
    throw new error("Error Occured...!");
    alert(error);
  }
});


// find mentor

const findMentor = asyncHandler(async (req, res) => {
  const userId = req.query.userId;
  const userMail = req.query.Email;

  try {
    const user = userId
      ?await Mentor.findById(userId)
      :await userList.findOne({ Email: userMail });
  
    const { Password, isActive, ...other } = user._doc;

    res.status(201).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});



module.exports = {
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
};
