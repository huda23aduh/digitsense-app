import Employees from "../models/EmployeeModel.js";
import path from "path";
import fs from "fs";
import {Op} from "sequelize";
 
export const getEmployees = async(req, res) => {

    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 3;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Employees.count(
        {
            where:{
                [Op.or]: [{name:{
                    [Op.like]: '%'+search+'%'
                }}]
            }
        }
    ); 
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Employees.findAll({
        where:{
            [Op.or]: [{name:{
                [Op.like]: '%'+search+'%'
            }}]
        },
        offset: offset,
        limit: limit,
        order:[
            ['id', 'DESC']
        ]
    });
    res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage
    });

}

export const getEmployeeById = async(req, res)=>{
    try {
        const response = await Employees.findOne({
            where:{
                id : req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const editEmployee = async(req, res)=>{
    const employee = await Employees.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!employee) return res.status(404).json({msg: "No Data Found"});
     
    let fileName = "";
    if(req.files === null){
        fileName = employee.image;
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + '_' + new Date().getTime().toString() + ext;
        const allowedType = ['.png','.jpg','.jpeg'];
 
        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});
 
        const filepath = `./public/images/${employee.image}`;
        fs.unlinkSync(filepath);
 
        file.mv(`./public/images/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
    }
    const name = req.body.name;
    const age = req.body.age;
    const address = req.body.address;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
     
    try {
        await Employees.update({
            name: name, 
            age: age, 
            address: address, 
            image: fileName, 
            url: url},{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Product Updated Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}
 
export const saveEmployee = (req, res)=>{
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const name = req.body.name;
    const age = req.body.age;
    const address = req.body.address;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + '_' + new Date().getTime().toString() + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];
 
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});
 
    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Employees.create({
                name: name, 
                address: address, 
                age: age, 
                image: fileName, 
                url: url});
            res.status(201).json({msg: "employee Created Successfuly"});
        } catch (error) {
            console.log(error.message);
        }
    })
 
}

export const deleteEmployee = async(req, res)=>{
    const employee = await Employees.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!employee) return res.status(404).json({msg: "No emp Data Found"});
 
    try {
        const filepath = `./public/images/${employee.image}`;
        fs.unlinkSync(filepath);
        await Employees.destroy({
            where:{
                id : req.params.id
            }
        });
        res.status(200).json({msg: "Emp Deleted Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}