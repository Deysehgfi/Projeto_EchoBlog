import { DataTypes } from "sequelize";
import conn from "../config/conn.js";
import Postagem from "./Postagens-Models.js";
import Usuarios from "./Usuarios-models.js";


const Comentarios = conn.define("comentarios",{

    comentario: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName:"comentarios"
})

Usuarios.belongsToMany(Postagem, {through:"comentarios"})

Postagem.belongsToMany(Usuarios, {through:"comentarios"} )


export default Comentarios;
