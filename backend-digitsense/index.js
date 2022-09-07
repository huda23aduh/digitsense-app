import express from "express";
import FileUpload from "express-fileupload";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/Database.js";
import router from "./routes/index.js";
dotenv.config();
const app = express();
 
app.use(cors({ credentials:true, origin:'http://localhost:3001' }));
app.use(cookieParser());
app.use(FileUpload());
app.use(express.static("public"));
app.use(express.json());
app.use(router);
 
app.listen(5001, ()=> console.log('Server running at port 5001'));