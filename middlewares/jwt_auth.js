const jwt=require("jsonwebtoken")
require("dotenv/config")

const jwt_auth = async (req, res, next) => {
  const token = req.cookies.token || '';
  try {
    if (!token) {
      return res.status(401).json('Por favor inicie sesión')
    }
    const decrypt = await jwt.verify(token, process.env.JWT_KEY);
    req.user = {
      id: decrypt.id,
      username: decrypt.username,
    };
    next();
  } catch (err) {
    return res.status(500).json({error: "error de autorización"});
  }
};

module.exports = jwt_auth;