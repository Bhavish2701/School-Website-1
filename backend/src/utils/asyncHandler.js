/**
 * Async handler utility to wrap async express route handlers
 * and pass any rejected promises to the next error middleware.
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
