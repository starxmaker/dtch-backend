const jwt = require('jsonwebtoken');
require("dotenv/config")

const generateToken = (res, id, username) => {
  const expiration = 604800000;
  const token = jwt.sign({ id}, process.env.JWT_KEY, {
    expiresIn: '7d',
  });
  const token_header = jwt.sign({username }, process.env.JWT_KEY_HEADER, {
    expiresIn: '7d',
  });
  res.cookie('token', token, {
    expires: new Date(Date.now() + expiration),
    secure: false,
    httpOnly: true,
  });
  return token_header
};
module.exports = generateToken
