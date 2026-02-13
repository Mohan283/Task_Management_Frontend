import '../style.css';
import { useEffect, useState } from 'react';
import API from '../config/api'

const MainDashboard = () => {
  const [taskCounts, setTaskCounts] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  const [tasks, setTasks] = useState([])

  const [filteredData, setFilteredData] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  // 🔹 Date Filter Logic
  const handleFilter = () => {
    const filtered = tasks.filter(item => {
      const itemDate = new Date(item.date);
      return (
        itemDate >= new Date(fromDate) &&
        itemDate <= new Date(toDate)
      );
    });
    setFilteredData(filtered);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB");
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await API.get('{API_URL}/task/manage-task');
      setTasks(res.data.tasks);
      setTaskCounts(res.data.counts);
    };
    fetchTasks();
  }, []);


  return (
    <>
      <div className='admin-main'>
        <h2 className='mt-4'>Welcome!</h2>
        <p className='mb-4 day'>{new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}</p>
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
      </div>

      <div className="row">
        {/* 🔹 Date Picker Section */}
        <div className="mb-3 d-flex gap-3 align-items-end admindp">
          <div>
            <label>From Date</label>
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div>
            <label>To Date</label>
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={handleFilter}>
            Filter
          </button>

        </div>
        <h4 className='total-task'>Total Tasks</h4>
        {
  filteredData.length === 0 ? (
    <div className="col-12 text-center mt-4">
      <p className="text-muted fs-5">No tasks yet.</p>
    </div>
  ) : (
    filteredData.map(taskCount => (
      <div key={taskCount._id} className="col-lg-4 col-md-6 col-sm-12 mb-3 p-3 card-col">
        <div className="card h-100 admin-card">
          <div className="card-body">
            <h3 className='card-title'>Title: {taskCount.title}</h3>
            <p className="card-text">Description: {taskCount.description}</p>
            <p className="card-text">Date: {new Date(taskCount.date).toLocaleDateString("en-GB")}</p>
            <p className="card-text">Priority: {taskCount.priority}</p>
            <p className="card-text">
              Assigned to: {taskCount.assignedTo?.[0]?.name || "Not Assigned"}
            </p>
            <p className="card-text">
              Due Date: {new Date(taskCount.dueDate).toLocaleDateString("en-GB")}
            </p>
            <p
              className={`card-text card-status ${
                taskCount.status === "Pending"
                  ? "status-pending"
                  : taskCount.status === "In Progress"
                  ? "status-progress"
                  : taskCount.status === "Completed"
                  ? "status-completed"
                  : ""
              }`}
            >
              Status: {taskCount.status}
            </p>
          </div>
        </div>
      </div>
    ))
  )
}
      </div>

    </>
  )
}

export default MainDashboard
