import { Sequelize } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const Users = db.define('users',{
    name:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    refresh_token:{
        type: DataTypes.TEXT
    },
    picture:{
        type: DataTypes.STRING
    },
    age:{
        type: DataTypes.INTEGER
    },
    address:{
        type: DataTypes.STRING
    },
},{
    // freezeTableName:true,
    timestamps: false
});
 
(async () => {
    await db.sync();
})();
 
export default Users;