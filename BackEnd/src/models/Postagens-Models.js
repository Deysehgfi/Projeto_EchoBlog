import conn  from "../config/conn.js";

import { DataTypes } from "sequelize";


import Usuarios from "./Usuarios-models.js";

const Postagem = conn.define("postagens", 
{
    id:{
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: true,
        required: true
    },
    conteudo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    autor: { 
        type: DataTypes.STRING,
        allowNull: true
    }
  
    
},{
    tableName: "postagens",
})

Usuarios.hasMany(Postagem)
Postagem.belongsTo(Usuarios)
export default Postagem;