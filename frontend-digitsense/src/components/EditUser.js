import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
 
const EditUser = () => {
    const host = 'http://localhost:5001';
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [address, setAddress] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
 
  useEffect(() => {
    getUserById();
  }, []);
 
  const getUserById = async () => {
    const response = await axios.get(host + `/users/${id}`);
    setName(response.data.name);
    setAge(response.data.age);
    setAddress(response.data.address);
  };
 
 
  const updateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("age", age);
    formData.append("name", name);
    formData.append("address", address);
    try {
      await axios.patch(host + `/users/${id}`, formData, {
        headers: {
          "Content-type": "form-data",
        },
      });
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
 
  return (
    <div className="columns is-centered mt-5">
      <div className="column is-half">
        <form onSubmit={updateUser}>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Age</label>
            <div className="control">
              <input
                type="text"
                className="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Address</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
              />
            </div>
          </div>
 
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-success">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
 
export default EditUser;