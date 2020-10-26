const jwt = require('jsonwebtoken');
require("dotenv/config")

const generateToken = (res, id, username) => {
  const expiration = 21600;
  const token = jwt.sign({ id}, process.env.JWT_KEY, {
    expiresIn: '6h',
  });
  const token_header = jwt.sign({username }, process.env.JWT_KEY_HEADER, {
    expiresIn: '6h',
  });
  res.cookie('token', token, {
    expires: new Date(Date.now() + expiration),
    secure: true,
    httpOnly: true,
  });
  return token_header
};
module.exports = generateToken
