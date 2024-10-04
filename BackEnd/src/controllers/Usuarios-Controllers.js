import { z } from "zod";
import Usuarios from "../models/Usuarios-models.js" //import a tabela
import bcrypt from "bcrypt"; //criptografar a senha do usuario 
import formatZodError from "../helpers/formatZodError.js"
import createUserToken from "../helpers/create-user-token.js";


const createSchema = z.object({
    nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracthers" }).transform((txt) => {
        txt.toLowerCase()
    }),
    email: z.string().email({ message: "Formato do email invalido" }),
    senha: z.string().min(6, { message: "A senha deve ter no minimo 6 caracthers" }),
    // papel: z.enum(['leitor', 'administrador', 'autor']).default('leitor')
})

const loginSchema = z.object({
    email: z.string().email({message: "Email inavalido"}),
    senha: z.string().min(6,{message:"A senha deve conter no minino 6 caracthers "})

})


export const createUser = async (request, response) => {

    const bodyValidation = createSchema.safeParse(request.body)

    if (!bodyValidation.success) {
        response.status(400).json({
            error: "Os dados recebidos do corpo da requisição são inválidos",
            detalhes: formatZodError(bodyValidation.error)
        })
        return;
    }

    const { nome, email, senha } = request.body
    // const {} = bodyValidation.data -> pode ser utilizado da mesma forma que o request body

//se tiver alguma informação vinda do body ele cria se nao vai ser leitor
    const papel = request.body.papel || "leitor"

    //criptografando a senha 
    const salt = bcrypt.genSaltSync(12)
    const senhaCrypt = bcrypt.hashSync(senha,salt)



    const newUser = {
        nome, 
        email, 
        senha: senhaCrypt, 
        papel
    }
    try {
        //validação
        //1° Verificar um email existente
        const verificaEmail = await Usuarios.findOne({where: {email}})

        if(verificaEmail){
            return response.status(401).json({err: "E-mail já está em uso!"})
        }

        //2° cadastrar o usuario 
        await Usuarios.create(newUser)

        const selectNovoUsuario = Usuarios.findOne({where: {email}, raw: true})

        await createUserToken(selectNovoUsuario,request, response)
        response.status(201).json({ message: "Usuário cadastrado com sucesso! ✨" })


    } catch (error) {
        console.log(error)
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
    const loginValidation = loginSchema.safeParse(request.body)

    if(!loginValidation.success){
       return response.status(400).json({
            err: "os dados recebidos do corpo da aplicação são inválidos",
            detalhes: formatZodError(loginValidation.error)
        })
        
    }


    const { email, senha } = loginValidation.data;
    //todos os dados vindos da requisição.body 


    try {

        //verificar se o email exite no banco de dados
        const usuario = await Usuarios.findOne({ where: { email } });

        if (!usuario) {
            return response.status(404).json({ err: "Usuário não encontrado" });
        }

        //retorna dois valores -> True || False
        const compararSenha = await bcrypt.compare(senha, usuario.senha);
        console.log("email:", usuario.email)
        console.log("senha:", senha)
        console.log("senha do usuario:", usuario.senha)
        console.log("comparar senha:", compararSenha)


        if (!compararSenha) {
            //pode adicionar uma variavel contadora
            return response.status(401).json({ err: "Senha inválida" });
        }
         await createUserToken(usuario, request, response);

        response.status(200).json(usuario);
    } catch (error) {
        console.log(error)
        response.status(500).json({ err: "Erro ao buscar usuário" });
    }
}

export const updateUsuario = async (request, response) => {

    const paramsValidation = getSchema.safeParse(request.params)
    if (!paramsValidation.success) {
        response.status(400).json({
            message: "Os dados recebidos do corpo da requisição são inválidos",
            detalhes: formatZodError(paramsValidation.error)
        })
        return
    }

    const bodyValidation = createSchema.safeParse(request.body)
    if (!bodyValidation.success) {
        response.status(400).json({
            message: "Os dados recebidos do corpo da requisição são inválidos",
            detalhes: formatZodError(bodyValidation.error)
        })
        return
    }
    const { id } = request.params

    const { nome, email, senha } = request.body

    const UsuarioAtualizado = {
        nome,
        email,
        senha
    }
    try {
        const [linhasAfetadas] = await Usuarios.update(UsuarioAtualizado, { where: { id } });
        console.log(linhasAfetadas)
        if (linhasAfetadas <= 0) {
            response.status(404).json({ message: "Usuario não encontrado" })
            return;
        }
        response.status(200).json({ message: "Usuario Atualizado com sucesso ✨" })
    } catch (error) {
        response.status(500).json({ err: "Error ao Atualizar usuario " })
    }
}   