import express, { request, response } from "express";

import "dotenv/config";
import cors from "cors";

import conn from "./config/conn.js"


//models 
import "./models/Postagens-Models.js"

const PORT = process.env.PORT || 3333

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
//responsavel por url de imagens
app.use(express.json())

conn.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor on http://localhost:${PORT}`)
    })
}).catch((err) => { console.error(err) })


app.use((request, response) => {
    response.status(404).json({ message: "Rota não encontrada (404)" })
})