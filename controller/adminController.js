const { response } = require("express");
const Category = require("../Model/CategorySchema");
const asynchandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const Categories = require("../Model/CategorySchema");
const users = require("../Model/StudentSchema");
const CourseSChema = require("../Model/CourseSChema");
const jwt = require("jsonwebtoken");
const mentorCollection = require("../Model/Mentor");
//@desc Create new Api Admin Login
//@route get /AdminHome
//@access private

const AdminLogin = asynchandler(async (req, res) => {
  const admin = req.body;

  try {
    if (admin) {
      if (
        admin.Email === process.env.ADMIN_MAIL &&
        admin.password === process.env.ADMIN_PASS
      ) {
        const payload = { firstname: "Admin", Email: admin.Email };
        const secretToken = process.env.ACCESS_TOKEN_ADMIN;

        const accesstoken = jwt.sign(payload, secretToken, { expiresIn: "6m" });

        res.status(201);
        res.json({ accesstoken, Email: admin.Email });
      } else {
        res.status(401);
        throw new Error("Invalid Authorization");
      }
    } else {
      res.status(401);
      throw new Error("fill the form please");
    }
  } catch (error) {
    alert(error);

    res.status(500).json({ error: "Internal Server Error" });
  }
});

//@desc Create new Api for category  creation
//@route get /AddnewCategory
//@access private

const AddCategory = asynchandler(async (req, res) => {
  const name = req.body.CategoryName;

  try {
    const base64String = req.file.buffer.toString("base64");

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${base64String}`,
      {
        public_id: name,
        resource_type: "image",
        folder: "CategoryImages",
        context: {
          categoryName: name,
        },
        tags: name,
      }
    );

    if (result) {
      const { CategoryName, Description } = req.body;
      const Image = result.secure_url;
      await Categories.create({
        CategoryName,
        Description,
        Image,
      })
        .then((response) => {
          res.json({ response });
        })
        .catch((err) => {
          res.json({ err });
        });
    }
  } catch (error) {
    res.status(400);
    throw new error("Uploding Failed! try Again");
  }
});

//@desc Create new Api for getting  all  Categories
//@route get /categories
//@access private

const Getcategories = async (req, res) => {
  try {
    await Categories.find().then((response) => {
      res.json({ res: response.filter((item) => !item.isDelete) });
    });
  } catch (error) {
    res.status(404);
    throw new error("Not found");
  }
};

//@desc Create new Api for getting  all  Users
//@route get /Usermanagement
//@access private

const Allusers = asynchandler(async (req, res) => {
  try {
    const Allusers = await users.find().sort({ createdAt: -1 });
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const Startindex = (page - 1) * limit;
    const lastindex = page * limit;
    const result = {};
    result.totalusers = Allusers.length;
    result.pagecount = Math.ceil(Allusers.length / limit);

    if (lastindex < Allusers.length) {
      result.next = {
        page: page + 1,
      };
    }
    if (Startindex > 0) {
      result.prev = {
        page: page - 1,
      };
    }

    result.results = Allusers.slice(Startindex, lastindex);

    res.json(result);
  } catch (error) {
    res.status(404);
    throw new Error("Not Found ");
  }
});

//@desc Create new Api for getting Block
//@route get /Usermanagement
//@access private

const Blockuser = asynchandler(async (req, res) => {
  try {
    const userid = req.params.id;
    users
      .updateOne({ _id: userid }, { isActive: false })
      .then((response) => {
        res.status(201).json({ message: "updated on successfully " });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    res.status(404);
    throw new error(error);
  }
});

//@desc Create new Api for getting  unblock
//@route get /Usermanagement
//@access private

const Unblockuser = asynchandler(async (req, res) => {
  try {
    const userid = req.params.id;
    users.updateOne({ _id: userid }, { isActive: true }).then((response) => {
      res.status(201).json({ success: "updated successfully" });
    });
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

//@desc Create new Api for getting  aLL COURSES
//@route get /Courses
//@access private

const GetAllcourse = asynchandler(async (req, res) => {
  const { limit } = req.query;
  console.log(limit);

  try {
    CourseSChema.find()
      .limit(limit)
      .sort({ createdAt: -1 })
      .then((response) => {
        res.json({ response });
      })
      .catch((err) => {
        res.status(404);
        throw new Error("Not found");
      });
  } catch (error) {
    alert(error, "could find any Courses");
  }
});

//@desc Create new Api for getting  all mentors
//@route get /Mentor
//@access private

const allMentors = asynchandler(async (req, res) => {
  const { page, limit } = req.query;

  try {
    const allMentors = await mentorCollection.find();
    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;

    let response = {};
    response.totalusers = allMentors.length;
    response.pagecount = Math.ceil(allMentors.length / limit);

    response.next =
      lastIndex < allMentors.length ? { page: parseInt(page) + 1 } : null;
    response.prev = startIndex > 0 ? { page: parseInt(page) - 1 } : null;

    const paginatedResult = allMentors.slice(startIndex, lastIndex);

    let result = paginatedResult.map((item) => {
      const { Password, ...other } = item._doc;

      return other;
    });
    response.result = result;
    res.json(response);
  } catch (error) {
    throw new Error("Not Found");
  }
});

//@desc Create new Api for getting Block
//@route get /Usermanagement
//@access private

const blockMentor = asynchandler(async (req, res) => {
  try {
    const userid = req.params.id;
    mentorCollection
      .updateOne({ _id: userid }, { isActive: false })
      .then((response) => {
        res.status(201).json({ message: "updated on successfully " });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    res.status(404);
    throw new error(error);
  }
});

//@desc Create new Api for getting  unblock
//@route get /Usermanagement
//@access private

const UnblockMentor = asynchandler(async (req, res) => {
  try {
    const userid = req.params.id;

    mentorCollection
      .updateOne({ _id: userid }, { isActive: true })
      .then((response) => {
        res.status(201).json({ success: "updated successfully" });
      });
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

//@desc Create new Api for getting  unblock
//@route get /Usermanagement
//@access private

const deleteCategory = async (req, res) => {
  const { id } = req.query;
  console.log(id);
  try {
    await Categories.updateOne({ _id: id }, { $set: { isDelete: true } }).then(
      (response) => {
        res.status(201).json({ message: "Deleted Succesfully", res: response });
      }
    );
  } catch (error) {
    res.status(401).json(error);
  }
};

//@desc Create new Api disable Course
//@route get /Usermanagement
//@access private
const disableCourse = async (req, res) => {
  const { id } = req.query;
  console.log(id);
  try {
    await CourseSChema.updateOne(
      { _id: id },
      { $set: { isvisible: true } }
    ).then((response) => {
      res.status(201).json({ message: "Disabled Succesfully", res: response });
    });
  } catch (error) {
    res.status(401).json(error);
  }
};
//@desc Create new Api enable Course
//@route get /Usermanagement
//@access private

const enableCourse = async (req, res) => {
  const { id } = req.query;

  try {
    await CourseSChema.updateOne(
      { _id: id },
      { $unset: { isvisible: 1 } }
    ).then((response) => {
      res.status(201).json({ message: "enabled succesfully" });
    });
  } catch (error) {
    res.status(401).json({ message: error });
  }
};
//@desc Create new Api for search in course
//@route get /seacrcourse
//@access private
const search = async (req, res) => {
  const { searchTerm } = req.query;
  console.log(searchTerm);
  try {
    await CourseSChema.find({
      $or: [
        { Title: { $regex: searchTerm, $options: "i" } },
        { Description: { $regex: searchTerm, $options: "i" } },
      ],
    }).then((response) => {
      console.log(response);
      res.status(201).json({ message: "Found Search Result", res: response });
    });
  } catch (error) {
    res.status(401).json({ message: error });
  }
};

//@desc Create new Api for search User
//@route get /SearchUSer
//@access private
const searchUser = async (req, res) => {
  const { searchTerm } = req.query;
  console.log(searchTerm);
  try {
    await users
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

// finding Recent User for admin DashBord

const CoursePercentage = async (req, res) => {
  try {
    await CourseSChema.aggregate([
      {
        $group: {
          _id: "$Category",
          count: { $sum: 1 },
        },
      },
    ]).then((response) => {
      console.log(response);
      res.json({ res: response });
    });
  } catch (error) {
    console.log(error);
    res.json({ res: error });
  }
};

// totalCourses

const totalCourses = async (req, res) => {
  try {
    const result = await CourseSChema.find().count();
    console.log(result);
    res.json({ msg: result });
  } catch (error) {
    res.json({ msg: error });
  }
};

module.exports = {
  AddCategory,
  Getcategories,
  Allusers,
  Blockuser,
  Unblockuser,
  GetAllcourse,
  AdminLogin,
  allMentors,
  UnblockMentor,
  blockMentor,
  deleteCategory,
  disableCourse,
  enableCourse,
  search,
  searchUser,
  CoursePercentage,
  totalCourses,
};
