import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const SeatCard = ({ studentArr, setStudentArr, student, index, isReadOnly }) => {

    const host = useSelector((state) => state.host.host);
    const exam = (useSelector((state) => state.exam)).examSelected;
    const auth = useSelector((state) => state.auth);
    const loading = useSelector((state) => state.loadingStatus);
    const floorNumber = (useSelector((state) => state.floorNumber)).floorNumber;
    const roomNumber = (useSelector((state) => state.roomNumber)).roomNumber;



    const handleSeatClick = async (student) => {
        let flag = true;
        // console.log("isReadOnly in seat clcik: ", isReadOnly);
        // Return if attendance is marked as read_only
        if (isReadOnly === true) {
            Swal.fire({
                title: 'Alert',
                text: 'Attendance cannot be changed now.',
                icon: 'error', // Options: 'success', 'error', 'warning', 'info'
            });
            return;
        }

        Swal.fire({
            title: 'Student Information',
            html: `<div class="flex flex-col ">
                      <div class="flex min-w-[75%] ">
                          <span class=" min-w-[75px]">Name </span>
                          <span ><b>${student.studentName}</b></span>
                      </div>
                      <div class="flex min-w-[75%] ">
                          <span class="min-w-[75px]">UID </span>
                          <span ><b>${student.studentUID}</b></span>
                      </div>
                      <div class="flex min-w-[75%] ">
                          <span class="min-w-[75px]">Exam </span>
                          <span ><b>${student.examDetails.examName}</b></span>
                      </div>
                  </div>`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Present',
            cancelButtonText: 'Absent',
        }).then(async (result) => {
            if (!result.isConfirmed) {
                student.isPresent = false;
                flag = false;
            } else {
                student.isPresent = true;
                flag = true;
            }
            // console.log("student: ", student);

            //   const res = await fetch(`${host}/api/student/update-student`, {
            //     method: "POST",
            //     headers: {
            //       'Content-Type': 'application/json',
            //       'auth-token': localStorage.getItem('auth-token')
            //     },
            //     body: JSON.stringify({ student, email: JSON.parse(localStorage.getItem('email')) })
            //   });

            //   const data = await res.json();
            try {
                const response = await axios.post(`${host}/api/student/update-student`, {
                    student: student
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
                const newArr = studentArr.map((item) =>
                    item.studentUID === student.studentUID ? { ...item, isPresent: student.isPresent } : item
                );
                setStudentArr(newArr);

            } catch (error) {
                // console.log(error);
            }

        });


    }

    return (
        <div onClick={() => { handleSeatClick(student) }} className='flex flex-col items-center gap-3 cursor-pointer border border-slate-400 p-3 rounded-md hover:shadow-lg'>
            <div className='flex items-center gap-5 '>
                <img src="/seat-icon-removebg-preview.png" alt='seat' className='w-20' />
                <div className='space-y-2'>

                    <p className='text-xl text-center'>{student.examDetails.seatNumber}</p>
                    <p className='text-xl'>{student.studentUID.padStart(10, '0')}</p>
                </div>
            </div>
            <div className={`w-3 h-3 ${student.isPresent ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
        </div>
    )

}

export default SeatCard