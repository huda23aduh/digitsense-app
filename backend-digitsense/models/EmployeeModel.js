import { Sequelize } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const Employees = db.define('employees',{
    name:{
        type: DataTypes.STRING
    },
    image:{
        type: DataTypes.STRING
    },
    url:{
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
 
export default Employees;