import jwt from "jsonwebtoken";

//assincrona
const createUserToken = async (usuario, request, response) => {
    //criar Token
    //login do usuario
    const token = jwt.sign(
        {
            nome: usuario.nome,
            id: usuario.id,
        },
        "1234567" //senha 

    )

    //retornar o token

    response.status(200).json({
        message: "Você está logado!",
        token: token,
        usuarioId: usuario.id
    })
}

export default createUserToken;