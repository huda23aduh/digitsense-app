import { Sequelize } from "sequelize";
 
const db = new Sequelize('crud-express-react-db', 'root', '12341234', {
    host: "localhost",
    dialect: "mysql"
});
 
export default db;