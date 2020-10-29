const express= require("express")
const cors= require("cors")
const mongoose=require("mongoose")
const bodyParser=require("body-parser")
const cookieParser = require("cookie-parser")
const helmet= require("helmet")
require("dotenv/config")
const app=express()



//middlewares
app.use(helmet())
app.use(cors({
  origin: process.env.FRONT_URL,
    credentials: true
  }))

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));





//routes

const publicadoresRoutes = require("./routes/publicadores")
app.use("/publicadores", publicadoresRoutes)

const usuariosRoutes = require("./routes/usuarios")
app.use("/usuarios", usuariosRoutes)
const fuentesRoutes = require("./routes/fuentes")
app.use("/fuentes", fuentesRoutes)
const telefonosRoutes=require("./routes/telefonos")
app.use("/telefonos", telefonosRoutes)

const gruposRoutes=require("./routes/grupos")
app.use("/grupos", gruposRoutes)

const historialsRoutes=require("./routes/historials")
app.use("/historials", historialsRoutes)

const estadisticasRoutes=require("./routes/estadisticas")
app.use("/estadisticas", estadisticasRoutes)

const listasRoutes=require("./routes/listas")
app.use("/listas", listasRoutes)

const miscRoutes = require("./routes/misc")
app.use("/misc", miscRoutes)


app.get("/",(req, res) =>{
  res.send("servidor arriba")
})


//base de datos

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log("conectado a la base de datos")
})

//puerto de entrada
app.listen(process.env.PORT)