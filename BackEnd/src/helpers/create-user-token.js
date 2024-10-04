import jwt from "jsonwebtoken";

import "dotenv/config";

const createUserToken = async (usuario, request, response) => {
        const token = jwt.sign({
            nome: usuario.nome,
            id: usuario.id
        }, process.env.TOKEN_PASSWORD, {
            expiresIn: "12h" // o token expira em 12hrs
        });

        response.status(200).json({
            message: "Você está autenticado",
            token: token,
            usuarioID: usuario.id
        });
};

export default createUserToken;