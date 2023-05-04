const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async(req, res, next) => {
  let token;

  let authheader = req.headers.authorization || req.headers.Authorization;

  if (authheader) {
  
    token = authheader.split(" ")[1];
    console.log("token", token);
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decodedUser) => {
        
      if (err) {
        res.status(401);
        throw new Error("User is not Authorized or Invalid Token");
      }

      req.user=decodedUser
      next()
    });
  }
});


const validateTokenforStudents = asyncHandler(async(req, res, next) => {
  let token;

  let authheader = req.headers.authorization || req.headers.Authorization;
  console.log(authheader);
  if (authheader) {
  
    token = authheader.split(" ")[1];
    console.log("token", token);
    jwt.verify(token, process.env.ACCESS_TOKEN_STUDENT, (err, decodedUser) => {
        
      if (err) {
        res.status(401);
        throw new Error("Student is not Authorized or Invalid Token");
      }

      req.user=decodedUser
      next()
    });
  }
});


module.exports = {validateToken,validateTokenforStudents};
