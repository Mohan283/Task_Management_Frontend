import { useState} from "react";
import '../style.css';
import bg from '../assets/bg.svg'
import {Link, useNavigate} from 'react-router-dom'
import toast from "react-hot-toast";
import API from '../config/api'

const AdminLogin = () => {

   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate(); 

 const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

         const validateLogin = () => {
  if (!email.trim()) return "Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Enter a valid email address";

  if (!password.trim()) return "Password is required";

  if (password.length < 6)
    return "Password must be at least 6 characters";

  return null;
};

        const validationError = validateLogin();
  if (validationError) {
    toast.error(validationError);
    return;
  }

  try {
    const response = await API.post(
      '/auth/admin-login',
      { email, password },
    );

    sessionStorage.setItem("isLoggedIn", "true");
    navigate("/admin-dashboard");

  } catch (err) {
    toast.error("Invaild Email or Password")
  }
};


  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12 login-col">
            <div className="login-img">
                    <img src={bg} className='img-fluid login-image'/>
                </div>
          </div>
           <div className="col-lg-6 col-md-12 col-sm-12 login-col1">
            <h1 className='signup-head'>Admin login!</h1>
              <form onSubmit={handleLogin}>
               
              <label for="exampleInputPassword1">Email Address</label>
              <input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                placeholder="john@xample.com"
                type="email"
                className="form-control login-mail"
              />
                
              <label for="exampleInputPassword1">Password</label>
              <input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                placeholder="Min 6 Characters"
                type="password"
                className="form-control login-password"
              />

              {error && <p className='text-danger'>{error}</p>}
         
          <button type="submit" class="btn btn-primary mt-3 mb-3">Submit</button>   
          <p>
              Member login <Link to="/">Login</Link>
            </p> 
        
              </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminLogin
