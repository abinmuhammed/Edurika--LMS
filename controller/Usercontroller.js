const asyncHandler = require("express-async-handler");
const StudentS = require("../Model/StudentSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Courses = require("../Model/CourseSChema");
const categories = require("../Model/CategorySchema");
const userList = require("../Model/StudentSchema");
const mentorCollection=require("../Model/Mentor")
const { response } = require("express");

//@desc Create new Api
//@route get /SignupAsStudent
//@access public

const StudentSignup = asyncHandler(async (req, res) => {
  ("124");
  req.body;
  const { FirstName, LastName, Email, Mobile, Password } = req.body;
  if (!FirstName || !LastName || !Email || !Mobile || !Password) {
    res.status(400);
    throw new Error("all fields are mandetory !");
  }

  const StudentAvailable = await StudentS.findOne({ Email });

  if (StudentAvailable) {
    res.status(400);
    throw new Error("User Already Registerd");
  }

  //hash password

  const hashPassword = await bcrypt.hash(Password, 10);

  const newstudent = await StudentS.create({
    FirstName,
    LastName,
    Email,
    Mobile,
    Password: hashPassword,
  });

  if (newstudent) {
    res.status(201).json({ Email: newstudent.Email });
  } else {
    res.status(400);
    throw new Error("user data is  invalid ");
  }

  res.send("success");
});

//@desc Create new Api
//@route get /loginAsStudent
//@access public

const StudentLogin = asyncHandler(async (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    res.status(400);
    throw new Error("All Fields are Mandetory");
  }

  const student = await StudentS.findOne({ Email });
  if (student.isActive) {
    if (student && (await bcrypt.compare(Password, student.Password))) {
      const payload = {
        firstname: student.FirstName,
        Email: student.Email,
      };
      const secretToken = process.env.ACCESS_TOKEN_STUDENT;
      const accesstoken = jwt.sign(payload, secretToken, { expiresIn: "6m" });
      res
        .status(201)
        .json({ accesstoken,FirstName:student.FirstName, Email: student.Email, id: student._id });
    } else {
      res.status(401);
      throw new Error("Invalid Credentials..!");
    }
  } else {
    res.status(401);
    throw new Error("User is Blocked ..!");
  }
});

//@desc Create new Api
//@route get /test API
//@access private

const privateApi = asyncHandler(async (req, res) => {
  res.status(201).send("configured private Route");
});

//@desc Create new Api for getting  all  Categories
//@route get /categories
//@access private

const getallCourse = asyncHandler(async (req, res) => {
  const Categoryid = req.params.id;
  try {
    await categories
      .findOne({ _id: Categoryid })
      .then(async (response) => {
        response, "category";
        await Courses.find({ Category: response.CategoryName })
          .then((response) => {

             
            let result=response.filter((item)=>!item.isvisible)

            res.status(201);
            res.json({ response: result});
          })
          .catch((err) => {
            res.status(404);
            throw new Error("No Courses in this Section");
          });
      })
      .catch((err) => {
        res.status(404);
        throw new Error(" Category Not Found");
      });
  } catch (error) {}
});


//@desc Create new Api for finding a user
//@route get /user
//@access private



const findUser = asyncHandler(async (req, res) => {
  const userId = req.query.userId;
  const userMail = req.query.Email;
console.log(userMail);
  try {
    const user = userId
      ?await userList.findById(userId)
      :await userList.findOne({ Email: userMail });
  
    const { Password, isActive, ...other } = user._doc;

    res.status(201).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});


//@desc Create new Api for search User
//@route get /SearchUSer
//@access private
const searchMentor= async (req, res) => {
  const { searchTerm } = req.query;
  try {
    await mentorCollection
      .find({
        $or: [
          { FirstName: { $regex: searchTerm, $options: "i" } },
          { LastName: { $regex: searchTerm, $options: "i" } },
        ],
      })
      .then((response) => {
        console.log(response);
        res.status(201).json({ message: "Found Search Result", res: response });
      });
  } catch (error) {
    res.status(401).json({ message: "no found ", err: error });
  }
};


module.exports = { StudentSignup, StudentLogin, privateApi, getallCourse,findUser,searchMentor };
