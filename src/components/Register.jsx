import { useState } from "react";
import "../style.css";
import bg from "../assets/bg.svg";
import ProfilePhotoSelector from "./ProfilePhotoSelector";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from '../config/api'

const Register = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

       const validateLogin = () => {
  if (!email.trim()) return "Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Enter a valid email address";

  if (!password.trim()) return "Password is required";

  if (password.length < 6)
    return "Password must be at least 6 characters";

  return null;
};

  const handleSignUp = async (e) => {
  e.preventDefault();
  setError(null);

  const validationError = validateLogin();
  if (validationError) {
    toast.error(validationError);
    return;
  }

  try {
    let profileImageUrl = "";

    // 1️⃣ Upload image first
    if (profilePic) {
      const uploadRes = await uploadImage(profilePic);
      profileImageUrl = uploadRes.imageUrl; // adjust key if needed
    }

    // 2️⃣ Register user (JSON)
    const payload = {
      name,
      email,
      password,
      profileImageUrl
    };

    const response = await API.post(
      '/user/user-register',
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Signup success:", response.data);
    navigate("/");
  } catch (err) {
    console.error("Signup error:", err.response || err);
    setError(
      err.response?.data?.message ||
      "Something went wrong. Please try again."
    );
  }
};


  return (
    <div className="container-fluid">
      <div className="row">
        {/* LEFT IMAGE */}
        <div className="col-lg-6 col-md-12 col-sm-12 login-col">
          <div className="login-img">
            <img src={bg} className="img-fluid login-image" alt="Register" />
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="col-lg-6 col-md-12 col-sm-12 login-col1">
          <h1 className="signup-head">Create an Account</h1>

          <form onSubmit={handleSignUp}>
            <ProfilePhotoSelector
              image={profilePic}
              setImage={setProfilePic}
            />

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control login-mail"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group mt-2">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control login-mail"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mt-2">
              <label>Password</label>
              <input
                type="password"
                className="form-control login-password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

          

            <button type="submit" className="btn btn-primary mt-3 mb-3">
              Submit
            </button>

            <p>
              Having an account? <Link to="/">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
