const jwt=require("jsonwebtoken")
require("dotenv/config")
const Usuario = require('../models/Usuario') 

const jwt_auth = async (req, res, next) => {
  
 

  const token =req.cookies['token'] || '' ;
  const csrfToken= req.headers.csrftoken || ''

   try{
     const decrypt=await jwt.verify(token, process.env.JWT_KEY)
     if (csrfToken!=decrypt.csrfToken) throw "tokens no son iguales"
     
    next();
  }catch (err){
    if (err.name=="TokenExpiredError"){
      const result=await regenerateToken(res, token, csrfToken)
      if (result){
        next()
      }else{
        res.status(501).json({error: "Error de inicio de tokens"})
      }
    }else{
      console.log(err)
      res.status(500).json({error: "Error de autenticación"})
    }
  }
   
};

const regenerateToken = async (res,oldToken, csrfToken) =>{
  try{
    const payload = await jwt.verify(oldToken, process.env.JWT_KEY, {ignoreExpiration: true} );

    const username=payload.username
    const user=await Usuario.findOne({username: username})

    const refresh=user.refresh
    const decrypt=await jwt.verify(refresh, process.env.REFRESH_KEY);
    if (decrypt.csrfToken!=csrfToken) throw "tokens no coinciden"

    const token = jwt.sign({ username, csrfToken}, process.env.JWT_KEY, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    res.cookie('token', token, {
      secure: process.env.PROFILE=="PRODUCTION",
    httpOnly: process.env.PROFILE=="PRODUCTION",
    sameSite: process.env.PROFILE=="PRODUCTION" ? "none" : "strict"
    });
    return true
  }catch (err){
    console.log(err)
    return false
  }
}

module.exports = jwt_auth;