import React, { useState, useEffect } from "react";
import API from '../config/api'
import { LuTrash } from "react-icons/lu";
import toast from "react-hot-toast";

const CreateTask = () => {

  const [user, setUser] = useState([]);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "low",
    date: "",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

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


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateTask = () => {
    if (!taskData.title.trim()) return "Task title is required";
    if (!taskData.description.trim()) return "Task description is required";
    if (!taskData.priority) return "Priority is required";
    if (!taskData.date) return "Task date is required";
    if (!taskData.dueDate) return "Due date is required";
    if (!taskData.assignedTo || taskData.assignedTo.length === 0)
      return "Please assign the task to a user";

    return null;
  };


  const createTask = async () => {

    const validationError = validateTask();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", taskData.title);
      formData.append("description", taskData.description);
      formData.append("priority", taskData.priority);
      formData.append("date", taskData.date);
      formData.append("dueDate", taskData.dueDate);
      formData.append("assignedTo[]", taskData.assignedTo);

      taskData.attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await API.post(
        "/task/create-task",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Task successfully created");

      setTaskData({
        title: "",
        description: "",
        priority: "low",
        date: "",
        dueDate: "",
        assignedTo: [],
        todoChecklist: [],
        attachments: [],
      });

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };
  // Update any value
  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle attachment selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setTaskData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...selectedFiles],
    }));
  };

  // Remove attachment
  const handleRemoveFile = (index) => {
    const newFiles = [...taskData.attachments];
    newFiles.splice(index, 1);
    setTaskData((prev) => ({ ...prev, attachments: newFiles }));
  };



  return (
    <div className="admin-main">
      <h2 className="mt-2 mb-3">Create Task</h2>

      <div className="create-lab">
        <label>Task Title</label>
        <input
          placeholder="Create App UI"
          className="form-input"
          value={taskData.title}
          onChange={(e) => handleValueChange("title", e.target.value)}
          required
        />
      </div>

      <div className="create-lab mt-2">
        <label>Task Description</label>
        <textarea
          placeholder="Describe Task"
          className="form-input"
          rows={4}
          value={taskData.description}
          onChange={(e) => handleValueChange("description", e.target.value)}
        />
      </div>

      {/* ROW */}
      <div className="row">
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="create-lab mt-2">
            <label>Priority</label>
            <select
              className="form-select"
              value={taskData.priority}
              onChange={(e) => handleValueChange("priority", e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>


        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="create-lab mt-2">
            <label>Date</label>
            <input
              type="date"
              className="form-input"
              value={taskData.date}
              onChange={(e) => handleValueChange("date", e.target.value)}
            />
          </div>
        </div>


        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="create-lab mt-2">
            <label>Assigned To</label>
            <select
              className="form-select"
              value={taskData.assignedTo[0] || ""}
              onChange={(e) => handleValueChange("assignedTo", e.target.value)}
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

        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="create-lab mt-2">
            <label>Due Date</label>
            <input
              type="date"
              className="form-input"
              value={taskData.dueDate}
              onChange={(e) => handleValueChange("dueDate", e.target.value)}
            />
          </div>
        </div>

      <div className="col-lg-4 col-md-6 col-sm-6">
        {/* Attachments */}

        <div className="create-lab mt-2">
          <label className="todo-title">Add Attachments</label>

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="form-input"
          />

          {/* Selected files preview */}
          {taskData.attachments.length > 0 && (
            <div className="attach-list mt-2">
              {taskData.attachments.map((file, index) => (
                <div key={index} className="attach-item">
                  <span className="attach-name">{file.name}</span>
                  <button
                    type="button"
                    className="attach-del-btn"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <LuTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
              </div>
      </div>

      <div className="create-btn">
        <button
          type="button" // important to prevent form submission reload
          onClick={createTask}
          disabled={loading}
          className="add-btn"
        >
          {loading ? "Creating..." : "CREATE TASK"}
        </button>
      </div>
    </div>
  )
}

export default CreateTask
