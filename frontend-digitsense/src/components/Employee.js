/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { 
    useNavigate,
    Link
} from 'react-router-dom';
import ReactPaginate from "react-paginate";
 
const Employee = () => {
    const host = 'http://localhost:5001';
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(3);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
 
    useEffect(() => {
        refreshToken();
        getUsers();
        getEmployees();
    }, [page, keyword]);
 
    const refreshToken = async () => {
        try {
            const response = await axios.get(host + '/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    }
 
    const axiosJWT = axios.create();
 
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5001/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
 
    const getUsers = async () => {
        const response = await axiosJWT.get(host + '/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setUsers(response.data);
    }

    const getEmployees = async () => {
        const response = await axiosJWT.get(host + `/employees?search_query=${keyword}&page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setEmployees(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
    }

    const deleteEmployee = async (userId) => {
        try {
        await axios.delete(host + `/employees/${userId}`);
        getEmployees();
        } catch (error) {
        console.log(error);
        }
    };

    const changePage = ({ selected }) => {
        setPage(selected);
        if (selected === 9) {
        setMsg(
            "change your keyword search"
        );
        } else {
        setMsg("");
        }
    };

    const searchData = (e) => {
        e.preventDefault();
        setPage(0);
        setMsg("");
        setKeyword(query);
    };
 
    return (
        <div className="container mt-5">
            <h1>Welcome Back: {name}</h1>
            <Link to="/employees/add" className="button is-success">
                Add New
            </Link>
            {/* <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>age</th>
                        <th>address</th>
                        <th>image</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.length > 0 &&  employees.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.age}</td>
                            <td>{user.address}</td>
                            <td>
                                <figure className="image is-128x128">
                                    <img src={user.url} alt="Preview Image" />
                                </figure>    
                            </td>
                            <td>
                                <Link to={`/employees/${user.id}`} className="card-footer-item">
                                    Edit
                                    </Link>
                                    <a
                                    onClick={() => deleteEmployee(user.id)}
                                    className="card-footer-item"
                                    >
                                    Delete
                                    </a>
                            </td>
                        </tr>
                    ))}
 
                </tbody>
            </table> */}

            <div className="container mt-5">
                <div className="columns">
                    <div className="column is-centered">
                    <form onSubmit={searchData}>
                        <div className="field has-addons">
                            <div className="control is-expanded">
                                <input
                                type="text"
                                className="input"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Find something here..."
                                />
                            </div>
                            <div className="control">
                                <button type="submit" className="button is-info">
                                Search
                                </button>
                            </div>
                        </div>
                    </form>
                    <table className="table is-striped is-bordered is-fullwidth mt-2">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Address</th>
                            <th>image</th>
                            <th>Action</th>

                        </tr>
                        </thead>
                        <tbody>
                        {employees.length > 0 && employees.map((user) => (
                            <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.age}</td>
                            <td>{user.address}</td>
                            <td>
                                <figure className="image is-128x128">
                                    <img src={user.url} alt="Preview Image" />
                                </figure>    
                            </td>
                            <td>
                                <Link to={`/employees/${user.id}`} className="card-footer-item">
                                    Edit
                                    </Link>
                                    <a
                                    onClick={() => deleteEmployee(user.id)}
                                    className="card-footer-item"
                                    >
                                    Delete
                                    </a>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <p>
                        Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
                    </p>
                    <p className="has-text-centered has-text-danger">{msg}</p>
                    <nav
                        className="pagination is-centered"
                        key={rows}
                        role="navigation"
                        aria-label="pagination"
                    >
                        <ReactPaginate
                            previousLabel={"< Prev"}
                            nextLabel={"Next >"}
                            pageCount={Math.min(10, pages)}
                            onPageChange={changePage}
                            containerClassName={"pagination-list"}
                            pageLinkClassName={"pagination-link"}
                            previousLinkClassName={"pagination-previous"}
                            nextLinkClassName={"pagination-next"}
                            activeLinkClassName={"pagination-link is-current"}
                            disabledLinkClassName={"pagination-link is-disabled"}
                        />
                    </nav>
                    </div>
                </div>
                </div>

        </div>
    )
}
 
export default Employee