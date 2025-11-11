// notFound.js - 404 Not Found middleware

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404; // Set statusCode so errorHandler uses it
  next(error);
};

module.exports = notFound;




