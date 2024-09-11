import express, { request, response } from "express";

import "dotenv/config";
import cors from "cors";
import  path  from "node:path"
import { fileURLToPath } from "node:url";

// npm install --save multer


import conn from "./config/conn.js"

//Router 
import PostagensRoutes from "./routes/Postagens-Routers.js"
import UsuariosRoutes from "./routes/Usuarios-Routes.js"
//models 
import "./models/Postagens-Models.js"
import "./models/Usuarios-models.js"
import { url } from "node:inspector";

const PORT = process.env.PORT || 3333

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log(__filename)
console.log(__dirname)

app.use(cors())
app.use(express.urlencoded({ extended: true }))
//responsavel por url de imagens
app.use(express.json())

//middleware necessário para imagens
app.use("/public",express.static(path.join(__dirname, "public")))

conn.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor on http://localhost:${PORT}`)
    })
}).catch((err) => { console.error(err) })


app.use("/postagens", PostagensRoutes)
app.use("/usuarios", UsuariosRoutes)

app.use((request, response) => {
    response.status(404).json({ message: "Rota não encontrada (404)" })
})