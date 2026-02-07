import {useState, useEffect, useRef } from 'react';
import {Link} from 'react-router-dom'
import { LuTrash, LuUserPen   } from "react-icons/lu";
import toast from 'react-hot-toast';

const ManageTask = () => {

  const [getTask, setGetTask] = useState([])
  const tableRef = useRef(null);
const dataTableRef = useRef(null);
 

  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await API.get('API_URL}/task/manage-task');
          setGetTask(response.data.tasks)
  
        } catch (error) {
          console.log(error);
        }
      }
      fetchData()
  
    }, [])

  useEffect(() => {
  if (getTask.length > 0 && tableRef.current) {
    dataTableRef.current = new window.DataTable(tableRef.current, {
      responsive: true,
      paging: true,
      searching: true,
      ordering: true,
      destroy: true, // VERY IMPORTANT
    });
  }
}, [getTask]);



   async function delTask(taskId) {
  try {
    await API.delete('/task/delete-task/${taskId}');

    // Update state
    setGetTask(prevData => prevData.filter(task => task._id !== taskId));

    // Destroy DataTable immediately
    if (dataTableRef.current) {
      dataTableRef.current.destroy();
      dataTableRef.current = null;
    }

    toast.success("Task deleted successfully");
  } catch (err) {
    console.log(err);
    toast.error("Failed to delete task");
  }
}


  return (
    <>
    
    <div className='admin-main'>
       <h2 className="mt-4 mb-4">Manage Task</h2>
       <div class="table-responsive-sm">
       <table ref={tableRef} className="table table-striped userTable">
        <thead>
          
        <tr>
        <th scope='col'>S.no</th>
        <th scope='col'>Task title</th>
        <th scope='col'>Task Description</th>
        <th scope='col'>Date</th>
        <th scope='col'>Priority</th>
        <th scope='col'>Due Date</th>
        <th scope='col'>Assigned to</th>
        <th scope='col'>Update</th>
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
                <td>{new Date(task.dueDate).toLocaleDateString('en-gb')}</td>
                <td>
                {task.assignedTo?.map(user => user.name).join(", ")}
                </td>
               
                <td> <Link to={`/update-task/${task._id}`}> <LuUserPen /></Link></td>
                <td> <LuTrash onClick={()=>delTask(task._id)} style={{'color':'red'}} /></td>
                </tr>
           ))}               

            
        </tbody>
       </table>
       </div>

    </div>   
    
    </>
  )
}

export default ManageTask
