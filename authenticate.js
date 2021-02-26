const jwt = require('jsonwebtoken');
const config = require('./config');

// middleware to validate token
exports.verifyUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const verified = jwt.verify(token, config.secretKey);
    req.user = verified;
    next(); // to continue the flow
  } catch (err) {
    res.status(400).json({ error: "Please sign in" });
  }
};

exports.login = function(user) {
  const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        admin: user.admin
      },
      config.secretKey
  );
  return token;
};

exports.getUser = function(token) {
  try {
    const verified = jwt.verify(token, config.secretKey);
    return verified;
  } catch (err) {
    return null;
  }
};

exports.verifyAdmin = function(req, res, next) {
  try {
    const token = req.header("auth-token");
    const verified = jwt.verify(token, config.secretKey);
    if (verified.admin) {
      return next();
    } else {
      err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err); 
    }
  } catch (err) {
    return next(err);
  }
};