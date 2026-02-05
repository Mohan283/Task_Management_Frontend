import React, { useEffect, useState } from "react";
import axios from "axios";
import {Link, useParams, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;


const UpdateDasebase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  useEffect(() => {
    axios.get(`${API_URL}/user/singleDbData/${id}`)
      .then(res => setForm(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`${API_URL}/user/update-database/${id}`, form);
    navigate("/user-dashboard/view-database");
  };

  return (

     <div className="row">
                <form onSubmit={handleSubmit}>
    
                <div className="form-group db-form">
    
                  <div className="col-4 mt-2 form-input">
                    <label>Date</label>
                    <input
                      type="date"
                      className="form-control login-mail"
                      value={form.date}
                      onChange={(e) => setForm({ ...data, date: e.target.value })}
                    />
                  </div>
    
                  <div className="col-4 mt-2 form-input">
                  <label>Business Name</label>
                  <input
                    type="text"
                    className="form-control login-mail"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  /> 
                  </div>   
                            
    
                 <div className="col-4 mt-2 form-input">
                    <label>Contact Number</label>
                    <input
                      type="number"
                      className="form-control login-mail"
                      value={form.contactno}
                      onChange={(e) => setForm({ ...form, contactno: e.target.value })}
                    />
                  </div>
                    </div> 
                <div className="row db-form">
                  <div className="col-4 mt-2 form-input">
                    <label>Service Required</label>
                    <input
                      type="text"
                      className="form-control login-mail"
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                    />
                  </div>
    
                  <div className="col-4 mt-2 form-input">
                    <label class="form-label">Feedback</label>
                    <textarea
                      class="form-control"
                      onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                      value={form.feedback}
                      rows="3">
                    </textarea>
                  </div>
                  <div className="col-4 mt-2 form-input">
                    <label class="form-label">Status</label>
                    <select class="form-select">
                      <option selected value="Pending">Pending</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Completed">Completed</option>
                       onChange={(e) => setForm({ ...form, status: e.target.value })}
                      value={form.status}
                    </select>
                  </div>             
              </div> 
              <div> 
                 <button type="submit" className="btn btn-primary mt-3 mb-3">
                  Submit
                </button>
               
    
              </div>
                 
            
              </form>
    
            </div>      
  );
};

export default UpdateDasebase;
