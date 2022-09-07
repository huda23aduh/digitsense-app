import express from "express";
import { 
    getUsers, 
    getUserById, 
    editUser, 
    Register, 
    Login,
    Logout, 
    DeleteUser 
} from "../controllers/UserCtrl.js";

import { 
    getEmployees,
    getEmployeeById, 
    saveEmployee,
    editEmployee,
    deleteEmployee,
} from "../controllers/EmployeeCtrl.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
 
const router = express.Router();
 
router.get('/users', verifyToken, getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', editUser);
router.post('/users', Register);
router.delete('/users/:id', DeleteUser);

router.get('/employees', verifyToken, getEmployees);
router.get('/employees/:id', getEmployeeById);
router.post('/employees', saveEmployee);
router.patch('/employees/:id', editEmployee);
router.delete('/employees/:id', deleteEmployee);

router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
 
export default router;