const jwt=require("jsonwebtoken")
require("dotenv/config")

const jwt_auth = async (req, res, next) => {
  //const token = req.cookies['token'] || '';
  const token2= req.headers['access-token'] || ''
  try {
    if (!token2) {
      return res.status(401).json('Por favor inicie sesión')
    }
    //const decrypt = await jwt.verify(token, process.env.JWT_KEY);
    const decrypt2 = await jwt.verify(token2, process.env.JWT_KEY_HEADER);
    req.user = {
      //id: decrypt.id,
      username: decrypt2.username,
    };
    next();
  } catch (err) {
    return res.status(500).json({error: "error de autorización"});
  }
};

module.exports = jwt_auth;