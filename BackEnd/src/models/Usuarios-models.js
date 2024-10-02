import conn from "../config/conn.js";

import { DataTypes } from "sequelize";

const Usuarios = conn.define("usuarios",{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, //determinando o email ser unico
        validate:{ //validando que precisa ser um email
            isEmail: true
        }
    },
    senha: {
         type: DataTypes.STRING,
         allowNull: false
    },
    papel: {
        type: DataTypes.ENUM([["administrador", "autor","leitor"]])
        // values: ["administrador", "autor","leitor"],
        // allowNull: false -> não precisa pois ja esta atribuindo o valor
    }
},{
    tableName: "usuarios"
})


export default Usuarios;