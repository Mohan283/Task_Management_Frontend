import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { LuTrash, LuUserPen } from "react-icons/lu";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {Link} from 'react-router-dom'


const ViewDatabase = () => {

    const [dbData, setdbData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const tableRef = useRef(null);
    const dataTableRef = useRef(null);
 

    const today = new Date().toISOString().split("T")[0];

    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);

    useEffect(() => {
        fetchData();
    }, []);

    

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8000/user/allDbData");
            setdbData(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

   useEffect(() => {
  if (filteredData.length > 0) {

    // Destroy old instance
    if (dataTableRef.current) {
      dataTableRef.current.destroy();
    }

    // Init new DataTable
    dataTableRef.current = new window.DataTable(tableRef.current, {
      responsive: true,
      paging: true,
      searching: true,
      ordering: true,
    });
  }
}, [filteredData]);

    // 🔹 Date Filter Logic
    const handleFilter = () => {
        const filtered = dbData.filter(item => {
            const itemDate = new Date(item.date);
            return (
                itemDate >= new Date(fromDate) &&
                itemDate <= new Date(toDate)
            );
        });
        setFilteredData(filtered);
    };

    // 🔹 Export to Excel
    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Database");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const file = new Blob([excelBuffer], {
            type: "application/octet-stream"
        });

        saveAs(file, `Database_${fromDate}_to_${toDate}.xlsx`);
    };

        async function delDB(taskId)
    {
        await axios.delete(`http://localhost:8000/user/delete-database/${taskId}`)
        .then((res)=>
        {
            setdbData((prevData)=>prevData.filter((task)=>task._id !==taskId)) 
            // toast.success(res.data.message,{posistion:"top-center"})
            alert("Task deleted successfully")
        })
       
        .catch((err)=>
        {
            console.log(err)
        })
    }

    const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB");
};

    return (
        <>
            {/* 🔹 Date Picker Section */}
<div className="row mb-3 align-items-end view-date gy-2">
  
  <div className="col-lg-3 col-md-6 col-sm-6">
    <label>From Date</label>
    <input
      type="date"
      className="form-control"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
    />
  </div>

  <div className="col-lg-3 col-md-6 col-sm-6">
    <label>To Date</label>
    <input
      type="date"
      className="form-control"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
    />
  </div>

  <div className="col-lg-4 col-md-6 col-sm-6 d-flex gap-2 view-col2">
    <button className="btn btn-primary w-100" onClick={handleFilter}>
      Filter
    </button>

    <button className="btn btn-success w-100" onClick={downloadExcel}>
      Download
    </button>
  </div>

</div>


            {/* 🔹 Table */}
            <table ref={tableRef} className="table table-bordered userTable">
                <thead>
                    <tr>
                        <th>S.no</th>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Contact No</th>
                        <th>Service</th>
                        <th>Feedback</th>
                        <th>Status</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredData.map((temp, index) => (
                        <tr key={temp._id}>
                            <td>{index + 1}</td>
                            <td>{temp.date}</td>
                            <td>{temp.name}</td>
                            <td>{temp.contactno}</td>
                            <td>{temp.service}</td>
                            <td>{temp.feedback}</td>
                            <td>{temp.status}</td>
               
                            <td> <Link to={`/update-database/${temp._id}`}> <LuUserPen /></Link></td>
                     
                            <td><LuTrash onClick={()=>delDB(temp._id)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default ViewDatabase;
