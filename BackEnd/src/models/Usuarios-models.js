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
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    senha: {
         type: DataTypes.STRING,
         allowNull: true
    },
    papel: {
        type: DataTypes.ENUM,
        values: ["administrador", "autor","leitor"],
        allowNull: false
    }
},{
    tableName: "usuarios"
})


export default Usuarios;