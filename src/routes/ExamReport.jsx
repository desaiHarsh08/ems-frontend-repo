import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { toogleSidebar } from '../app/features/sidebarToggleSlice';


const ExamReport = () => {

  const navigate = useNavigate()

  const dispatch = useDispatch();

  const host = useSelector((state) => state.host.host);
  const auth = useSelector((state) => state.auth);

  const [searchObj, setSearchObj] = useState({
    examName: '',
    examDate: '',
  });
  const [searchObjStats, setSearchObjStats] = useState({
    examNameStats: '',
    examDateStats: '',
  });

  const [examStats, setExamStats] = useState([]);
  const [examStatsArr, setExamStatsArr] = useState([]);

  useEffect(()=> {
    dispatch(toogleSidebar());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchObj((prev) => ({ ...prev, [name]: value }));
  }

  const handleChangeStats = (e) => {
    const { name, value } = e.target;
    setSearchObjStats((prev) => ({ ...prev, [name]: value }));
  }

  const exportToExcelAttendance = (data, fileName) => {
    // data = data.data;
    // console.log(data); // Log the data
    const newArr = [];
    for (let i = 0; i < data.length; i++) {
      let obj = {
        name: data[i].studentName,
        uid: data[i].studentUID,
        attendance: data[i].isPresent ? 'Y' : 'N',
        ...data[i].examDetails
      }
      obj.examDate = obj.examDate.substring(0, obj.examDate.indexOf('T'));
      newArr.push(obj);
    }
    // console.log(newArr);
    const worksheet = XLSX.utils.json_to_sheet(newArr);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    XLSX.writeFile(workbook, fileName);
  };

  const exportToExcelStats = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    XLSX.writeFile(workbook, fileName);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // // console.log(searchObj)
    if (searchObj.examName == '' || searchObj.examDate == '') {
      Swal.fire({
        title: 'Alert',
        text: 'Please give the complete details!',
        icon: 'error', // Options: 'success', 'error', 'warning', 'info'
      });
      return;
    }

    const response = await axios.post(`${host}/api/student/get-student-by-date-name`,
      {
        searchObj
      },
      {
        headers: {
          accessToken: auth["user-credentials"].accessToken,
          refreshToken: auth["user-credentials"].refreshToken,
          email: auth["user-credentials"].user.email
        }
      }
    );
    exportToExcelAttendance(response.data.payload, `${searchObj.examDate}-${searchObj.examName}.xlsx`);
  }



  const handleSubmitExamStats = async (e) => {
    e.preventDefault()
    // console.log(searchObjStats)
    if (searchObjStats.examNameStats == '' || searchObjStats.examDateStats == '') {
      Swal.fire({
        title: 'Alert',
        text: 'Please give the complete details!',
        icon: 'error', // Options: 'success', 'error', 'warning', 'info'
      });
      return;
    }

    const response = await axios.post(`${host}/api/student/get-student-stats-date-name`,
      {
        examName: searchObjStats.examNameStats, examDate: searchObjStats.examDateStats
      },
      {
        headers: {
          accessToken: auth["user-credentials"].accessToken,
          refreshToken: auth["user-credentials"].refreshToken,
          email: auth["user-credentials"].user.email
        }
      }
    )
    exportToExcelStats(response.data.payload, `${searchObjStats.examDateStats}-${searchObjStats.examNameStats}-stats.xlsx`);

  }


  return (
    <div className='m-3'>
      <div className='heading mb-7'>
        <h1 className='text-2xl font-semibold my-3'>View Attendance</h1>
        <div className='w-full h-[2px] bg-blue-500 rounded-md'></div>
      </div>

      {/* View Attendance form */}
      <h2 className='text-xl font-medium my-2 '>Exam wise student report</h2>
      <form className=' flex flex-col sm:flex-row gap-3' onSubmit={handleSubmit}>
        <div className='flex gap-3 sm:gap-3 flex-col sm:flex-row'>
          <div className="examName">
            <label htmlFor="examName"></label>
            <input type="text" name="examName" value={searchObj.examName} onChange={handleChange} id="examName" className='px-4 py-2 border border-slate-400 rounded-md w-full sm:min-w-[200px]' placeholder='Enter the exam name...' />
          </div>
          <div className="examName">
            <label htmlFor="examDate"></label>
            <input type="date" name="examDate" value={searchObj.examDate} onChange={handleChange} id="examDate" className='px-4 py-2 border border-slate-400 rounded-md w-full sm:min-w-[200px]' placeholder='Enter the exam date...' />
          </div>
        </div>
        <div className="btns flex justify-center">
          <button type='submit' className='px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white'>Search</button>
        </div>
      </form>


      {/* Display the recent exam stats */}
      <h2 className='mt-7 text-xl font-medium my-2 '>Exam wise room report</h2>
      <form className=' flex flex-col sm:flex-row gap-3' onSubmit={handleSubmitExamStats}>
        <div className='flex gap-3 sm:gap-3 flex-col sm:flex-row'>
          <div className="examName">
            <label htmlFor="examNameStats"></label>
            <input type="text" name="examNameStats" value={searchObjStats.examNameStats} onChange={handleChangeStats} id="examName" className='px-4 py-2 border border-slate-400 rounded-md w-full sm:min-w-[200px]' placeholder='Enter the exam name...' />
          </div>
          <div className="examName">
            <label htmlFor="examDateStats"></label>
            <input type="date" name="examDateStats" value={searchObjStats.examDateStats} onChange={handleChangeStats} id="examDateStats" className='px-4 py-2 border border-slate-400 rounded-md w-full sm:min-w-[200px]' placeholder='Enter the exam date...' />
          </div>
        </div>
        <div className="btns flex justify-center">
          <button className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md'>Export</button>
        </div>
      </form>


      {/* <div id="mytable" className=' w-full overflow-x-auto'>
        <table class="table-auto w-full min-w-[860px] ">
          <thead className='border-2 border-slate-400 '>
            <tr>
              <th className='w-[16.66%] '>Exam Name</th>
              <th className='w-[16.66%] '>Date</th>
              <th className='w-[16.66%] '>Room No.</th>
              <th className='w-[16.66%] '>Total</th>
              <th className='w-[16.66%] '>Present</th>
              <th className='w-[16.66%] '>Absent</th>
            </tr>
          </thead>
          <tbody className='border-2 border-slate-400'>
            {examStats}
          </tbody>
        </table>
        <button onClick={handleRecentExamStatsDownload} className='my-7 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md'>Export</button>
      </div> */}
    </div>
  )
}

export default ExamReport
