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
      name: user.name,
      id: user._id,
      },
      config.secretKey
  );
  return token;
};

exports.getUserId = function(token) {
  try {
    const verified = jwt.verify(token, config.secretKey);
    return verified.id;
  } catch (err) {
    return null;
  }
};

exports.verifyAdmin = function(req, res, next) {
    if (req.user.admin)
        return next();
    else 
        err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err); 
};