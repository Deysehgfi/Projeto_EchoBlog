import { request, response, text } from "express";
import { z } from "zod";
import Usuarios from "../models/Usuarios-models.js"
import formatZodError from "../helpers/FormatZodError.js";


const createSchema = z.object({
    nome: z.string().min(3, {message: "O nome deve ter pelo menos 3 caracthers"}).transform((txt) => {
        txt.toLowerCase()}),
        email: z.string().email({message: "Formato do email invalido"}),
        senha: z.string().min(6, {message: "A senha deve ter no minimo 6 caracthers"}),
        papel: z.enum(['leitor', 'administrador', 'autor']).default('leitor')
})


export const createUser = async (request, response) => {

    const bodyValidation = createSchema.safeParse(request.body)

    if(!bodyValidation.success){
        response.status(400).json({
            message: "Os dados recebidos do corpo da requisição são inválidos",
            detalhes: formatZodError(bodyValidation.error)
        })
       return
    }

    const { nome, email, senha, papel}= request.body

    const newUser = {
        nome, email, senha, papel
    }
    try {
        await Usuarios.create(newUser)
        response.status(201).json({message: "Usuário cadastrado com sucesso! ✨"})
    } catch (error) {
        response.status(500).json({err: "Erro ao cadastrar Usuário"})
    }

}


