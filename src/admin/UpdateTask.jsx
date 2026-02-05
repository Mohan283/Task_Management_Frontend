import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios'
import toast from 'react-hot-toast'
import { useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const UpdateTask = () => {
  const { id } = useParams()
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

   const [user, setUser] = useState([]);

     useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/allUser`);
        setUser(response.data)

      } catch (error) {
        console.log(error);
      }
    }
    fetchData()

  }, [])


  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "low",
    date: "",
    dueDate: "",
    assignedTo: "",   // 👈 single user ID
    attachments: [],
  });


  ;
  // Update any value
  const handleValueChange = (key, value) => {
    setTask((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/task/single-task/${id}`)
      .then((res) => {
        console.log("FULL RESPONSE:", res.data);
        const t = res.data;

        setTask({
          title: t.title || "",
          description: t.description || "",
          priority: t.priority || "low",
          date: t.date ? t.date.slice(0, 10) : "",
          dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
          assignedTo: t.assignedTo?.[0] || "", // 👈 IMPORTANT
        });
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }, [id]);


  const updateTask = async () => {
  setLoading(true);
  setError("");

  try {
    const formData = new FormData();
    formData.append("title", task.title);
    formData.append("description", task.description);
    formData.append("priority", task.priority);
    formData.append("date", task.date);
     formData.append("assignedTo", task.assignedTo);
    formData.append("dueDate", task.dueDate);

    // append multiple files
    if (task.attachments?.length > 0) {
      task.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    await axios.put(
      `${API_URL}/task/update-task/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

     toast.success("Task updated created");
    navigate("/admin-dashboard/manage-task");
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};





  return (
    <>

      <div className="container mt-4">
        <h2 className="mt-4 mb-4 ms-3">Update Task</h2>

           
        <div className="create-lab">
          <label>Task Title</label>
          <input
            placeholder="Create App UI"
            className="form-input"
            value={task.title}
            onChange={(e) => handleValueChange("title", e.target.value)}
          />
        </div>

        <div className="create-lab mt-2">
          <label>Task Description</label>
          <textarea
            placeholder="Describe Task"
            className="form-input"
            rows={4}
            value={task.description}
            onChange={(e) => handleValueChange("description", e.target.value)}
          />
        </div>

        {/* ROW */}
        <div className="row">
          <div className="col-4">
            <div className="create-lab mt-2">
              <label>Priority</label>
              <select
                className="form-select"
                value={task.priority}
                onChange={(e) => handleValueChange("priority", e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="col-4">
            <div className="create-lab mt-2">
              <label>Due Date</label>
              <input
                type="date"
                className="form-input"
                value={task.dueDate}
                onChange={(e) => handleValueChange("dueDate", e.target.value)}
              />
            </div>
          </div>

          <div className="col-4">
            <div className="create-lab mt-2">
              <label>Assigned To</label>
              <select
                className="form-select"
                 value={task.assignedTo}
                onChange={(e) =>
                  handleValueChange("assignedTo", e.target.value)
                }
              >
                <option value="">Select User</option>

                {user.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>


          <div className="col-4">
            <div className="create-lab mt-2">
              <label>Attachments</label>
              <input
                type="file"
                multiple
                className="form-input"
                onChange={(e) =>
                  handleValueChange("attachments", Array.from(e.target.files))
                }
              />
            </div>
          </div>
      

        <div className="col-4">
          <div className="create-lab mt-2">
            <label>Date</label>
            <input
              type="date"
              className="form-input"
              value={task.date}
              onChange={(e) => handleValueChange("date", e.target.value)}
            />
          </div>
        </div>
  </div>

    

        <div className="create-btn">
          <button
            type="button" // important to prevent form submission reload
            onClick={updateTask}
            disabled={loading}
            className="add-btn"
          >
            {loading ? "Updating..." : "UPDATE TASK"}
          </button>
        </div>
      </div>
    </>
  )
}

export default UpdateTask
