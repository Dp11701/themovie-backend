const { constants } = require("../constants");
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case constants.VALIDATON_ERROR:
      res.json({
        title: "Validation Failed",
        message: err.message,
        stackTrace: err.track,
      });
      break;
    case constants.NOT_FOUND:
      res.json({
        title: "Not fould",
        message: err.message,
        stackTrace: err.track,
      });
    case constants.FORBIDEN:
      res.json({
        title: "for biden",
        message: err.message,
        stackTrace: err.track,
      });
    case constants.UNAUTHORIZED:
      res.json({
        title: "unauthoried",
        message: err.message,
        stackTrace: err.track,
      });
    case constants.SERVER_ERROR:
      res.json({
        title: "server error",
        message: err.message,
        stackTrace: err.track,
      });
    default:
      console.log("No error, all good");
      break;
  }
};

module.exports = errorHandler;
