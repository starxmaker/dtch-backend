const jwt = require('jsonwebtoken');
require("dotenv/config")

const generateToken = (res, id, username) => {
  const expiration = 604800000;
  const token = jwt.sign({ id, username }, process.env.JWT_KEY, {
    expiresIn: '7d',
  });
  return res.cookie('token', token, {
    expires: new Date(Date.now() + expiration),
    secure: false,
    httpOnly: true,
  });
};
module.exports = generateToken
