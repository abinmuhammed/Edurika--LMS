const { constents } = require("../constants");

const ErrorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case constents.VALIDATION_ERROR:
      res.json({
        Title: "Validation Failed",
        message: err.message,
        StackTrace: err.stack,
      });

      break;
    case constents.NOT_FOUND:
      res.json({
        Title: "Not found",
        message: err.message,
        StackTrace: err.stack,
      });
    case constents.UNAUTHORISED:
      res.json({
        Title: "UnAuthoroised",
        message: err.message,
        StackTrace: err.stack,
      });
    case constents.FORBIDDEN:
      res.json({
        Title: "FORBIDDEN",
        message: err.message,
        StackTrace: err.stack,
      });
    case constents.SERVERERROR:
      res.json({
        Title: "SERVER ERROR",
        message: err.message,
        StackTrace: err.stack,
      });

    default:
      console.log("NO error ALL GOOD");
      break;
  }
};
module.exports = ErrorHandler;
