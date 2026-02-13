
import { useState, useEffect } from 'react';
import API from '../config/api'

const UserTeamMembers = () => {

  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('/user/allUser');
        setUser(response.data)

      } catch (error) {
        console.log(error);
      }
    }
    fetchData()

  }, [])



  return (
    <>
      <div className='admin-main'>
        <h2 className='mt-4 mb-4'>Team Members</h2>

        <div className='d-flex align-items-center justify-content-center'>
          <div className="row p-2">
              {user.map((item) => (
                <div className="col-lg-4 col-md-6 col-sm-6 mb-4" key={item._id}>
                  <div className="card h-100 team-card">
                    <div className="card-inner">
                        <img
                      src={item.profileImageUrl}
                      className="card-img-top team-img"
                      alt={item.name}
                    />

                    <div className="card-body">
                      <p className="card-text">Name: {item.name}</p>
                      <p className="card-text">Email: {item.email}</p>
                    </div>
                    </div>
                    
                  </div>
                </div>
              ))}
        
          </div>   {/* row */}

        </div>

      </div>
    </>
  )
}

export default UserTeamMembers

