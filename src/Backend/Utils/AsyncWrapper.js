module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(err => next(err));
  };
};
// This function will take an async function "fn" and return a function whcih return a promise if any
// error occur then catch will be thrown error-
