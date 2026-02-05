
import { Link, Outlet,useLocation } from 'react-router-dom'
import { LuLayoutDashboard, LuSquarePlus, LuClipboardCheck, LuUsers, LuLogOut } from 'react-icons/lu';
import { useNavigate } from "react-router-dom"
import { useEffect, useState,useRef } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const contentRef = useRef(null);
const location = useLocation();

useEffect(() => {
  if (window.innerWidth <= 768 && contentRef.current) {
    contentRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}, [location.pathname]);


  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      
      setUser(res.data);
    };

    fetchUser();
  }, []);


  const handleLogout = () => {

    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <div className="container-fluid admin-background">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">Task Manager</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav ms-auto mb-2 mb-lg-0 me-5 mt-2 nav-admin">
                <li class="nav-item">

                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="row dash-row">
          <div className="col-lg-3 col-md-3 col-sm-12 order-2 order-md-1 dashboard-col" id="dash-col">
            <div className='d-flex justify-content-center align-items-center mt-4'>
              <div>
                <img
                  src={user?.profileImageUrl}
                  alt={user?.name}
                  className='avatar'
                />
                <p className='admin-name'>{user?.name}</p>
              </div>

            </div>
            <div className="box d-flex justify-content-center align-items-center p-2">
              <LuLayoutDashboard />
              <p className='mb-2'></p>
              <Link to="" className='sidebar-menu'>Dashboard</Link>
            </div>
            <div className="box d-flex justify-content-center align-items-center p-2">
              <LuSquarePlus />

              <Link to="database" className='sidebar-menu'>Database </Link>
            </div>
            <div className="box d-flex justify-content-center align-items-center p-2">
              < LuClipboardCheck />
              <Link to="user-manage-task" className='sidebar-menu'>Manage Task </Link>
            </div>
            <div className="box d-flex justify-content-center align-items-center p-2">
              <LuUsers />
              <Link to="user-team-members" className='sidebar-menu'>Team Members </Link>
            </div>
            <div className="box d-flex justify-content-center align-items-center p-2">
              <LuLogOut />
              <button
                onClick={handleLogout}
                className="sidebar-menu btn btn-link p-0">
                Logout
              </button>
            </div>
          </div>
          <div  ref={contentRef} className="col-lg-9 col-md-9 col-sm-12 order-1 order-md-2 dashboard-col1">
            <Outlet />

          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
