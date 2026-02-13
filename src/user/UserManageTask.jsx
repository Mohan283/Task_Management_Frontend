import {useState, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom';
import { LuTrash, LuUserPen   } from "react-icons/lu";
import toast from 'react-hot-toast'
import API from '../config/api'

const UserManageTask = () => {

   const [getTask, setTasks] = useState([]);
     const tableRef = useRef(null);
       const dataTableRef = useRef(null);

          useEffect(() => {
  if (getTask.length > 0) {
    // Destroy previous instance
    if (dataTableRef.current) {
      dataTableRef.current.destroy();
      dataTableRef.current = null;
    }

    // Delay init until DOM is ready
    setTimeout(() => {
      dataTableRef.current = new window.DataTable(tableRef.current, {
        responsive: true,
        paging: true,
        searching: true,
        ordering: true,
        destroy: true,
      });
    }, 0);
  }
}, [getTask]);


     useEffect(() => {
    const fetchUserTasks = async () => {
      const res = await API.get(
        '/task/my-tasks',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTasks(res.data);
    };

    fetchUserTasks();
  }, []);

     async function delTask(taskId)
    {
        await API.delete(`/task/delete-task/${taskId}`)
        .then((res)=>
        {
            setTasks((prevData)=>prevData.filter((task)=>task._id !==taskId)) 
            // toast.success(res.data.message,{posistion:"top-center"})
            toast.success("Task deleted successfully");
        })
       
        .catch((err)=>
        {
            console.log(err)
        })
    }

  return (
    
        <div className='admin-main'>
             <h2 className="mt-4 mb-4">Manage Task</h2>
           <table ref={tableRef} className="table table-bordered userTable">
            <thead>
              
            <tr>
            <th scope='col'>S.no</th>
            <th scope='col'>Task title</th>
            <th scope='col'>Task Description</th>
            <th scope='col'>Date</th>
            <th scope='col'>Priority</th>
            <th scope='col'>Due Date</th>
            {/* <th scope='col'>Assigned to</th> */}
            {/* <th scope='col'>Update</th> */}
            <th scope='col'>Delete</th>
            </tr>
            </thead>
            <tbody> 
            {getTask.map((task,index)=>
               (
                    <tr key={task._id}>  
                    <td>{index+1}</td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.date}</td>
                    <td>{task.status}</td>
                    <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                    {/* <td>
                    {task.assignedTo?.map(user => user.name).join(", ")}
                    </td> */}
                   
                    {/* <td> <Link to={`/update-task/${task._id}`}> <LuUserPen /></Link></td> */}
                    <td> <LuTrash onClick={()=>delTask(task._id)} className='trash-icon'/></td>
                    </tr>
               ))}               
    
                
            </tbody>
           </table>
    
        </div>  
  )
}

export default UserManageTask
