import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import SeatCard from '../components/route_components/seats-display/SeatCard';
import Swal from 'sweetalert2';

const SeatsDisplay = () => {

  const location = useLocation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const host = useSelector((state) => state.host.host);
  const exam = (useSelector((state) => state.exam)).examSelected;
  const auth = useSelector((state) => state.auth);
  const loading = useSelector((state) => state.loadingStatus);
  const floorNumber = (useSelector((state) => state.floorNumber)).floorNumber;
  const roomNumber = (useSelector((state) => state.roomNumber)).roomNumber;

  const [studentsArr, setStudentArr] = useState([]);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    fetchStudents();
    isRoomAttendanceMarked();
  }, []);

  const isRoomAttendanceMarked = async () => {
    try {
      const response = await axios.post(
        `${host}/api/exam_read_only/get-exam-obj`,
        {
          examName: exam.examName,
          examDate: exam.examDate,
          floorNumber: floorNumber,
          roomNumber: roomNumber
        },
        {
          headers: {
            accessToken: auth["user-credentials"].accessToken,
            refreshToken: auth["user-credentials"].refreshToken,
            email: auth["user-credentials"].user.email
          }
        }
      );
      // console.log(response);
      setIsReadOnly(true);
      
    } catch (error) {
      // console.log(error);
      return null;
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await axios.post(
        `${host}/api/student/get-students`,
        {
          examName: exam.examName,
          examDate: exam.examDate,
          floorNumber: floorNumber,
          roomNumber: roomNumber,
        },
        {
          headers: {
            accessToken: auth["user-credentials"].accessToken,
            refreshToken: auth["user-credentials"].refreshToken,
            email: auth["user-credentials"].user.email
          }
        }
      );
      // console.log(response.data.payload);
      setStudentArr(response.data.payload);
    } catch (error) {
      // console.log(error);
    }
  }

  const handleAfterReadOnlyStats = () => {
    return {
      total: studentsArr.length,
      present: studentsArr.filter((ele) => ele.isPresent === true).length,
      absent: studentsArr.filter((ele) => ele.isPresent === false).length
    }
  }

  const handleReadOnly = async () => {

    // console.log('read only');
    const obj = handleAfterReadOnlyStats();
    // console.log(obj);

    const confirmationResult = await Swal.fire({
      title: 'Are you sure?',
      html: `<div>
                      <h3 class="text-xl font-medium my-2"> Do you want to proceed with attendance confirmation for this room. Once confirmed, it cannot be changed further"</h3>
                      <div>
                        <div class="flex min-w-[75%] ">
                          <span class="min-w-[75px]">Total </span>
                          <span ><b>${obj.total}</b></span>
                        </div>
                        <div class="flex min-w-[75%] ">
                          <span class="min-w-[75px]">Present </span>
                          <span ><b>${obj.present}</b></span>
                        </div>
                        <div class="flex min-w-[75%] ">
                          <span class="min-w-[75px]">Absent </span>
                          <span ><b>${obj.absent}</b></span>
                        </div>
                      </div>
                  </div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'No, cancel',
    });


    if (confirmationResult.isConfirmed) {




      // console.log("obj in read only: ", obj);
      const res = await fetch(`${host}/api/exam_read_only/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({
          email: JSON.parse(localStorage.getItem('email')),
          examName: exam.examName,
          examDate: exam.examDate,
          floorNumber: localStorage.getItem('floorNumberSelected'),
          roomNumber: localStorage.getItem('roomNumber'),
        })
      });
      const data = await res.json();

      try {
        const response = await axios.post(`${host}/api/exam_read_only/create`, {
          examName: exam.examName,
          examDate: exam.examDate,
          floorNumber: floorNumber,
          roomNumber: roomNumber,
        },
          {
            headers: {
              accessToken: auth["user-credentials"].accessToken,
              refreshToken: auth["user-credentials"].refreshToken,
              email: auth["user-credentials"].user.email
            }
          }
        );

        // update state----
        // Create a new array and update the state

        Swal.fire({
          title: 'Alert',
          text: `Attendance for this room is successfully recorded.`,
          icon: 'success', // Options: 'success', 'error', 'warning', 'info'
        }).then(() => {
          navigate(`/dashboard/${exam._id}/floor-${floorNumber}`, { replace: true });
          // navigate(-1);
        });
      } catch (error) {
        // console.log(error);
      }

      // console.log(data)
      setIsReadOnly(true);
    }

  }

  return (
    <div className='my-3'>
      {/* DISPLAY THE SEATS */}
      <div className='flex flex-wrap gap-2 justify-center w-full'>
        {
          studentsArr.map((student, index) => (
            <SeatCard key={`seat-${index + 1}`} studentArr={studentsArr} setStudentArr={setStudentArr} student={student} index={index} isReadOnly={isReadOnly} />
          ))
        }
      </div>

      {/* FINAL SUBMISSION */}
      <div className='my-3 flex flex-col gap-3  items-center'>
   
        <button id='btn-read-only' disabled={isReadOnly} onClick={handleReadOnly} className={`${isReadOnly !== true ? 'bg-red-500 hover:bg-red-600' : 'bg-green-400'}  text-white font-medium px-4 py-2 rounded-md`}>{isReadOnly == true ? 'Submitted' : 'Final Submission'}</button>
      </div>
    </div>
  )
}

export default SeatsDisplay