
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import CreateTask from './admin/CreateTask'
import ProtectedRoute from './protectedRoutes/ProtectedRoutes'
import ManageTask from './admin/ManageTask'
import MainDashboard from './admin/MainDashboard'
import TeamMembers from './admin/TeamMembers'
import UpdateTask from './admin/UpdateTask'
import UserProtectedRoute from './protectedRoutes/UserProtectedRoutes'
import UserDashboard from './user/UserDashboard'
import Dashboard from './user/Dashboard'
import UserManageTask from './user/UserManageTask'
import Database from './user/Database'
import ViewDatabase from './user/ViewDatabase'
import UpdateDasebase from './user/UpdateDasebase'
import UserTeamMembers from './user/UserTeamMembers'
function App() {


  return (
    <>
      <Router>
        <Routes>
          {/* admin */}
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>}>
            <Route index path="" element={<MainDashboard />} />
            {/* Nested admin pages */}
            <Route  />
            <Route path="create-task" element={<CreateTask />} />
            <Route path="manage-task" element={<ManageTask />} />
            <Route path="view-database" element={<ViewDatabase/>}/>
            <Route path="team-members" element={<TeamMembers />} />
          </Route>
          <Route path="/update-task/:id" element={<UpdateTask />} />

          {/* user */}
          <Route path='/user-register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Login />} />

          <Route path="/user-dashboard" element={
            <UserProtectedRoute>
              <UserDashboard />
            </UserProtectedRoute>} >

            <Route path="" element={<Dashboard/>} />
            <Route path="user-manage-task" element={<UserManageTask/>} /> 
            <Route path="database" element={<Database/>} /> 
            <Route path="view-database" element={<ViewDatabase/>}/>
            <Route path="user-team-members" element={<UserTeamMembers/>}/>
          
            
            </Route>
          <Route path="/update-database/:id" element={<UpdateDasebase />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
