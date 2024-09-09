import { request, response, text } from "express";
import { z } from "zod";
import Usuarios from "../models/Usuarios-models.js"
import formatZodError from "../helpers/FormatZodError.js";
import conn from "../config/conn.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const createSchema = z.object({
    nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracthers" }).transform((txt) => {
        txt.toLowerCase()
    }),
    email: z.string().email({ message: "Formato do email invalido" }),
    senha: z.string().min(6, { message: "A senha deve ter no minimo 6 caracthers" }),
    papel: z.enum(['leitor', 'administrador', 'autor']).default('leitor')
})

export const createUser = async (request, response) => {

    const bodyValidation = createSchema.safeParse(request.body)

    if (!bodyValidation.success) {
        response.status(400).json({
            message: "Os dados recebidos do corpo da requisição são inválidos",
            detalhes: formatZodError(bodyValidation.error)
        })
        return
    }

    const { nome, email, senha, papel } = request.body

    const newUser = {
        nome, email, senha, papel
    }
    try {
        await Usuarios.create(newUser)
        response.status(201).json({ message: "Usuário cadastrado com sucesso! ✨" })
    } catch (error) {
        response.status(500).json({ err: "Erro ao cadastrar Usuário" })
    }

}

export const getAll = async (request, response) => {
    const page = parseInt(request.query.page) || 1

    const limit = parseInt(request.query.limit) || 10

    const offset = (page - 1) * limit
    try {

        const usuarios = await Usuarios.findAndCountAll({
            limit,
            offset
        })

        const totalPaginas = Math.ceil(usuarios.count / limit)


        response.status(200).json({
            totalUsuarios: usuarios.count,
            totalPaginas: totalPaginas,
            paginaAtual: page,
            itemsPorPages: limit,
            proximaPag: totalPaginas === 0 ? null : `http://localhost:3333/usuarios?page=${page + 1}`,
            Usuarios: usuarios.rows
        })


    } catch (err) {
        console.error(err)
        response.status(500).json({ message: "Erro ao listar usuários" })
    }
}


export const getUser = async (request, response) => {
    const { papel } = request.params
    if (papel !== "leitor" && papel !== "autor" && papel !== "administrador") {
        response.status(400).json({
            message: "Papel inválida. Use 'leitor' , 'autor' ou 'administrador'"
        })
        return;
    }
    try {
        const usuarios = await Usuarios.findAll({
            where: { papel: papel },
            raw: true,
        });
        response.status(200).json(usuarios)
    } catch (err) {
        response.status(500).json({ err: "Error ao buscar usuarios" })
    }
}

export const login = async (request, response) => {
    const { email, senha } = request.body;

    try {
        const usuario = await Usuarios.findOne({ where: { email } });

        if (!usuario) {
            return response.status(404).json({ err: "Usuário não encontrado" });
        }

        const compararSenha = await bcrypt.compare(senha, usuario.senha);
        console.log("senha:", senha)
        console.log("senha do usuario:", usuario.senha)
        console.log("comparar senha:", compararSenha)


        if (!compararSenha) {
            return response.status(401).json({ err: "Senha inválida" });
        }


        createUserToken(usuario, request, response);

        response.status(200).json(usuario);
    } catch (err) {
        response.status(500).json({ err: "Erro ao buscar usuário" });
    }

    //verificar se a senha existe/ comparar senha 
}