const jwt = require('jsonwebtoken');
require("dotenv/config") 
const Usuario = require('../models/Usuario') 
const { v4: uuidv4 } = require('uuid');

const generateToken = async (res, username, ip) => {
  const expiration = process.env.TOKEN_EXPIRATION;
  const refreshExpiration=process.env.REFRESH_EXPIRATION
  const csrfToken=uuidv4();

  
  const token = jwt.sign({ username, ip, csrfToken}, process.env.JWT_KEY, {
    expiresIn: expiration,
  });
  const refreshToken = jwt.sign({ username, ip, csrfToken}, process.env.REFRESH_KEY, {
    expiresIn: refreshExpiration,
  });
  
  res.cookie('token', token, {
    secure: process.env.PROFILE=="PRODUCTION",
    httpOnly: process.env.PROFILE=="PRODUCTION",
    sameSite: process.env.PROFILE=="PRODUCTION" ? "none" : "strict"
  });
  await Usuario.updateOne({username: username}, {$set: {refresh: refreshToken}})
  return csrfToken
};
module.exports = generateToken
