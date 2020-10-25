const express= require("express")
const router= express.Router()
const authenticateJWT = require("../middlewares/jwt_auth")

router.use(authenticateJWT)


router.get("/test", async (req, res) =>{
    res.status(200).json({message: "autentificado"})
})

module.exports = router