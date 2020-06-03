const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  if (req.headers.cookie) {
    const token = req.headers.cookie.split('token=')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({
          status: 'Fail',
          code: 401,
          message: 'Auth Error from authChecker',
        });
      } else {
        req.user = { userId: decoded.userId, email: decoded.email };

        next();
      }
    });
  } else {
    res.status(401).json({
      status: 'Fail',
      code: 401,
      message: 'Auth Error from authChecker',
    });
  }
};
