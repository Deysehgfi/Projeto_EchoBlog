import { response } from "express"
import jwt from "jsonwebtoken"

import Usuarios from "../models/Usuarios-models.js"

const getUserByToken = async (token) => {
    return new Promise(async (resolve, reject) => {
        if(!token){
            return response.status(401).json({err: "Acesso negado"});

        }

        const decoded = jwt.verify(token, process.env.TOKEN_PASSWORD)

        const usuario = await Usuarios.findByPk(decoded.id);

        if(!usuario){
            reject({err: "Erro ao buscar usuario"})
        } else {
            resolve(usuario)
        }
    })
}



export default getUserByToken;