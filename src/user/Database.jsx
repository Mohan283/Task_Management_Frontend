import { useState } from 'react';
import { Link } from 'react-router-dom'
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom"

const Database = () => {

  const navigate = useNavigate();
  const [data, setData] = useState({
    date: "",
    name: "",
    contactno: "",
    service: "",
    feedback: "",
    status: "Pending"
  });

  const validateLogin = () => {
  if (!data.date.trim()) return "Date is required";
  if (!data.name.trim()) return "Name is required";
  if (!data.service.trim()) return "Service is required";
  if (!data.contactno.trim()) return "Contact number is required";
  if (!data.feedback.trim()) return "Feedback is required";

  return null;
};


  const handleSignUp = async (e) => {

e.preventDefault();

   const validationError = validateLogin();
  if (validationError) {
    toast.error(validationError);
    return;
  }
    try {
      const response = await API.post(
        '/user/database',
        data);
      setData(response.data)
      toast.success("Data saved Successfully")

     // optional: reset form
      setData({
        date: "",
        name: "",
        contactno: "",
        service: "",
        feedback: "",
        status: ""
      });
    } catch (err) {
      console.error("Signup error");
    }
  }



  return (
    <>
      <div className="admin-main">
         <h2 className='mt-4'>Database</h2>
            <form onSubmit={handleSignUp}>

            <div className="row form-group db-form">

              <div className="col-lg-4 col-md-6 col-sm-6 mt-2 form-input">
                <label>Date:</label>
                <input
                  type="date"
                  className="form-control login-mail"
                  value={data.date}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                />
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 mt-2 form-input">
              <label>Business Name:</label>
              <input
                type="text"
                className="form-control login-mail"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
              /> 
              </div>   
                        

             <div className="col-lg-4 col-md-6 col-sm-6 mt-2 form-input">
                <label>Contact Number:</label>
                <input
                  type="number"
                  className="form-control login-mail"
                  value={data.contactno}
                  onChange={(e) => setData({ ...data, contactno: e.target.value })}
                />
              </div>
                </div> 
            <div className="row form-group db-form">
              <div className="col-lg-4 col-md-6 col-sm-6 mt-2 form-input">
                <label>Service Required:</label>
                <input
                  type="text"
                  className="form-control login-mail"
                  value={data.service}
                  onChange={(e) => setData({ ...data, service: e.target.value })}
                />
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6 mt-2 form-input">
                <label class="form-label">Feedback:</label>
                <textarea
                  class="form-control"
                  onChange={(e) => setData({ ...data, feedback: e.target.value })}
                  value={data.feedback}
                  rows="3">
                </textarea>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-6 mt-2 form-input">
                <label class="form-label">Status:</label>
                <select class="form-select">
                  <option selected value="Pending">Pending</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Completed">Completed</option>
                   onChange={(e) => setData({ ...data, status: e.target.value })}
                  value={data.status}
                </select>
              </div>             
          </div> 
          <div> 

             <div className='submit-div'>
                <button type="submit" className="btn btn-light view-da mt-3 mb-3">
              Submit
            </button>
              <Link to="/user-dashboard/view-database" className='btn btn-light view-data' >View Database</Link>
             </div>
             
          

          </div>
             
        
          </form>

        </div>      


    </>
  )
}

export default Database
