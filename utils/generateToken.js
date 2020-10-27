const jwt = require('jsonwebtoken');
require("dotenv/config")

const generateToken = (res, id, username) => {
  const expiration = process.env.EXPIRATION;
  const token = jwt.sign({ id}, process.env.JWT_KEY, {
    expiresIn: expiration,
  });
  const token_header = jwt.sign({username }, process.env.JWT_KEY_HEADER, {
    expiresIn: expiration,
  });
  res.cookie('token', token, {
    secure: process.env.HTTPS=="TRUE",
    //domain: process.env.DOMAIN,
    httpOnly: true,
    sameSite: "none"
  });
  return token_header
};
module.exports = generateToken
