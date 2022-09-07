import { BrowserRouter, Route, 
  Routes, 
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import EditUser from "./components/EditUser";
//employee
import Employee from "./components/Employee";
import EditEmployee from "./components/EditEmployee";
import AddEmployee from "./components/AddEmployee";
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/dashboard" element={<><Dashboard/><Navbar/></>} />
        <Route path="users/:id" element={<EditUser/>}/>
        <Route exact path="/employees" element={<><Employee/><Navbar/></>} />
        <Route exact path="/employees/add" element={<><AddEmployee/></>} />
        <Route path="employees/:id" element={<EditEmployee />}/>
      </Routes>
    </BrowserRouter>
    
  );
}
 
export default App;