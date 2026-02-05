import '../style.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { DateRangePicker } from "react-date-range";
import { LuCalendar } from "react-icons/lu";
import toast from 'react-hot-toast'
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const Dashboard = () => {

  const [user, setUser] = useState([]);

   const getFileIcon = (type = "") => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    if (type.includes("word")) return "📝";
    if (type.includes("excel")) return "📊";
    return "📎";
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8000/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    };

    fetchUser();
  }, []);

  /* ---------------- COUNTS ---------------- */
  const [taskCounts, setTaskCounts] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  /* ---------------- TASKS ---------------- */
  const [tasks, setTasks] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  /* ---------------- DATE PICKER ---------------- */

  const getCurrentMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
  };
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);




  /* ---------------- CLOSE ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".date-picker-wrapper")) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- FETCH COUNTS (ADMIN DATA) ---------------- */
  useEffect(() => {
    const fetchUserCounts = async () => {
      const res = await axios.get(
        "http://localhost:8000/task/my-task-counts",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setTaskCounts(res.data);
    };

    fetchUserCounts();
  }, []);


  /* ---------------- FETCH USER TASKS ---------------- */
  useEffect(() => {
    const fetchUserTasks = async () => {
      const res = await axios.get(
        "http://localhost:8000/task/my-tasks",
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

  /* ---------------- STATUS UPDATE ---------------- */
  const handleStatusChange = (taskId, value) => {
    setStatusMap((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const handleSubmitStatus = async (taskId) => {
    try {
      const updatedStatus = statusMap[taskId];

      await axios.put(
        `http://localhost:8000/task/update-status/${taskId}`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // ✅ UPDATE UI STATE IMMEDIATELY
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId
            ? { ...task, status: updatedStatus }
            : task
        )
      );

      toast.success("Task status updated");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status");
    }
  };
  /* ---------------- DATE FILTER ---------------- */
  const filteredTasks = tasks.filter((task) => {
    if (!task.date) return false;

    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);

    const startDate = new Date(range[0].startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(range[0].endDate);
    endDate.setHours(23, 59, 59, 999);

    return taskDate >= startDate && taskDate <= endDate;
  });

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <>
      <div className='admin-main'>
        <h2 className='mt-4 mb-2'>Welcome {user?.name}!</h2>
        <p className='mb-4 day'>{new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}</p>

        {/* ---------------- COUNTS ---------------- */}
        <div className="row status-row">
          <div className="col-lg-4 col-md-6 col-sm-12 status-count mb-4">
            <p><span className='tasks-indicator1'></span>Pending Tasks - {taskCounts.pending}</p>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 status-count mb-4">
            <p><span className='tasks-indicator2'></span> Inprogress Tasks - {taskCounts.inProgress}</p>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 status-count mb-4">
            <p><span className='tasks-indicator3'></span> Completed Tasks - {taskCounts.completed}</p>
          </div>
        </div>

        {/* ---------------- DATE PICKER ---------------- */}
        <div
          className="date-picker-wrapper position-relative mb-4"
          style={{ maxWidth: "320px" }}
        >
          <div className="input-group">
            <span className="input-group-text">
              <LuCalendar size={18} />
            </span>
            <input
              type="text"
              className="form-control"
              readOnly
              value={`${range[0].startDate.toLocaleDateString()} - ${range[0].endDate.toLocaleDateString()}`}
              onClick={() => setOpen(!open)}
            />
          </div>

          {open && (
            <div
              className="position-absolute bg-white shadow mt-2"
              style={{ zIndex: 1050 }}
            >
              <DateRangePicker
                ranges={range}
                onChange={(item) => {
                  setRange([item.selection]);
                }}
                moveRangeOnFirstSelection={false}
              />

            </div>
          )}
        </div>


        {/* ---------------- TASK LIST ---------------- */}
        {filteredTasks.length === 0 ? (
          <p className="text-muted text-center mt-4">
            No tasks found
          </p>
        ) : (
          <div className="row">
            {filteredTasks.map((task) => (
              <div key={task._id} className="col-lg-4 col-md-6 col-sm-6">
                <div className="card h-100 admin-card">
                  <div className="card-body">
                    <h5>Title: {task.title}</h5>
                    <p>Description: {task.description}</p>
                    <p>Date: {formatDate(task.date)}</p>
                    <p>Priority: {task.priority}</p>
                    <p>Due Date: {formatDate(task.dueDate)}</p>
                    {/* ---------------- ATTACHMENTS ---------------- */}
                    {task.attachments?.length > 0 && (
                      <div className="mt-2 attachments">
                        <p className="mb-1"><strong>Attachments:</strong></p>
                        <ul className="attachment-list">
                          {task.attachments.map((file, index) => (
                            <li key={index}>
                              <a
                                href={`http://localhost:8000${file.filePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="attachment-link"
                              >
                                {getFileIcon(file.fileType)} {file.originalName}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p
                      className={`card-text card-status ${task.status === "Pending"
                          ? "status-pending"
                          : task.status === "In Progress"
                            ? "status-progress"
                            : task.status === "Completed"
                              ? "status-completed"
                              : ""
                        }`}
                    >
                      Status: {task.status}
                    </p>

                    <select
                      className="form-select"
                      value={statusMap[task._id] || task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <div className='submit-div'>
                      <button
                        className="btn btn-primary status-submit mt-2"
                        onClick={() => handleSubmitStatus(task._id)}
                      >
                        Submit
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
