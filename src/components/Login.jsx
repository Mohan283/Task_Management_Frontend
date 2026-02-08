import { useState, useContext} from "react";
import '../style.css';
import bg from '../assets/bg.svg'
import {Link, useNavigate} from 'react-router-dom'
import { UserContext } from '../context/userContext'
import toast from "react-hot-toast";
import API from '../config/api'

const Login = () => {

   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate(); 
  const { updateUser } = useContext(UserContext);

  const validateLogin = () => {
  if (!email.trim()) return "Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Enter a valid email address";

  if (!password.trim()) return "Password is required";

  // if (password.length < 6)
  //   return "Password must be at least 6 characters";

  return null;
};

const handleLogin = async (e) => {
  e.preventDefault();
  console.log("LOGIN SUBMITTED");

  setError(null);

  const validationError = validateLogin();
  if (validationError) {
    toast.error(validationError);
    return;
  }

  try {
    const response = await API.post("/user/login", {
      email,
      password,
    });

    console.log("Login response:", response.data);

    localStorage.setItem("token", response.data.token);

    updateUser({
      _id: response.data._id,
      name: response.data.name,
      email: response.data.email,
      profileImageUrl: response.data.profileImageUrl,
    });

    navigate("/user-dashboard", { replace: true });
  } catch (err) {
    console.error("Login error:", err);
    setError(err.response?.data?.message || "Login failed");
    toast.error(err.response?.data?.message || "Login failed");
  }
};



  return (
    <>
   <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-5 mt-2 nav-admin">
        <li className="nav-item">
          <Link className="btn btn-light nav-link admin-log" to="/admin-login"> Admin</Link>
        </li>
      </ul>
    </div>
  </div>
   </nav>
      <div className="container-fluid">
        <div className="row login-row">
          {/* <div className="col-lg-6 col-md-12 col-sm-12 login-col">
            <div className="login-img">
                    <img src={bg} className='img-fluid login-image'/>
                </div>
          </div> */}
           <div className="col-lg-6 col-md-12 col-sm-12 login-col1">
            <h1 className='signup-head'>Member Login!!!</h1>
              <form onSubmit={handleLogin}>
               
              <label htmlFor="exampleInputPassword1">Email Address</label>
              <input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                placeholder="john@xample.com"
                type="email"
                className="form-control login-mail"
              />
                
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                placeholder="Min 6 Characters"
                type="password"
                className="form-control login-password"
              />
         
          <button type="submit" className="btn btn-primary mt-3 mb-3">Submit</button>    
         
          <p>Dont have an account <Link to="/user-register">Register</Link></p>
              </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
