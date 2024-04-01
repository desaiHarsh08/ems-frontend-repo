// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ExaminerCard from '../components/route_components/workspace/ExaminerCard'
// import AnswerScriptCountingRow from '../components/route_components/workspace/AnswerScriptCountingRow'
// import { toogleSidebar } from '../app/features/sidebarToggleSlice';

// const Workspace = () => {

//   const location = useLocation();

//   const navigate = useNavigate();

//   const dispatch = useDispatch();

//   const host = useSelector((state) => state.host.host);
//   const auth = useSelector((state) => state.auth);

//   const currentDate = `${(new Date()).getFullYear()}-${((new Date()).getMonth() + 1).toString().padStart(2, '0')}-${((new Date()).getDate()).toString().padStart(2, '0')}`
//   const [exam, setExam] = useState();
//   const [examinersArr, setExaminersArr] = useState([]);
//   const [invigilatorsArr, setInvigilatorsArr] = useState([]);
//   const [studentsArr, setStudentsArr] = useState([]);
//   const [allocationLimit, setAllocationLimit] = useState(7);
//   const [distributionArr, setDistributionArr] = useState([]);
//   const [examDetails, setExamDetails] = useState({
//     examName: (auth['user-credentials'].user.userType === 'EXAM_OC' || auth['user-credentials'].user.userType === 'SUPPORT_STAFF') ? auth['user-credentials'].user.examName : '',
//     examDate: (auth['user-credentials'].user.userType === 'EXAM_OC' || auth['user-credentials'].user.userType === 'SUPPORT_STAFF') ? auth['user-credentials'].user.examDate : currentDate
//   });

//   useEffect(() => {
//     if (exam) { return; }
//     const fetchData = async () => {
//       if (auth['user-credentials'].user.userType !== 'ADMIN') {
//         const tmpExam = await getExam();
//         const tmpExaminers = await getExaminers(tmpExam);
//         // await getStudents();
//       }
//     };

//     fetchData();
//   }, [exam]);

//   useEffect(() => {
//     distributionForAnswerScripts();
//     dispatch(toogleSidebar());
//   }, []);


//   useEffect(() => {
//     distributionForAnswerScripts();
//   }, [exam, examinersArr, studentsArr])

//   const handleExamDetails = (e) => {
//     const { name, value } = e.target;
//     // // console.log(name, value)
//     setExamDetails((prev) => ({ ...prev, [name]: value }));
//   }
//   const getExam = async () => {
//     // // console.log('in exam')
//     try {
//       const response = await axios.post(`${host}/api/exam/get-by-name-date`, examDetails, {
//         headers: {
//           accessToken: auth["user-credentials"].accessToken,
//           refreshToken: auth["user-credentials"].refreshToken,
//           email: auth["user-credentials"].user.email
//         }
//       });
//       // // console.log("Exam Fetched:", response);
//       setExam(response.data.payload);
//       return response.data.payload;
//     } catch (error) {
//       // // console.log(error);
//       return null;
//     }
//   }

//   const getExaminers = async (exam) => {

//     // // console.log("examiners: - ", exam._id)
//     try {
//       const response = await axios.post(`${host}/api/common_role_assign/user-examId`, {
//         userType: 'EXAMINER',
//         examId: exam._id
//       }, {
//         headers: {
//           accessToken: auth["user-credentials"].accessToken,
//           refreshToken: auth["user-credentials"].refreshToken,
//           email: auth["user-credentials"].user.email
//         }
//       });
//       // // console.log('examiners:', response.data.payload)
//       setExaminersArr(response.data.payload);
//       return response.data.payload;
//     } catch (error) {
//       // // console.log(error);
//       return null;
//     }
//   }

//   const getInvigilators = async (exam) => {

//     // // console.log("examiners: - ", exam._id)
//     try {
//       const response = await axios.post(`${host}/api/common_role_assign/user-examId`, {
//         userType: 'INVIGILATORS',
//         examId: exam._id
//       }, {
//         headers: {
//           accessToken: auth["user-credentials"].accessToken,
//           refreshToken: auth["user-credentials"].refreshToken,
//           email: auth["user-credentials"].user.email
//         }
//       });
//       // // console.log('invigilators:', response.data.payload)
//       setInvigilatorsArr(response.data.payload);
//       return response.data.payload;
//     } catch (error) {
//       // // console.log(error);
//       return null;
//     }
//   }

//   const getStudents = async () => {
//     // // console.log('in get students')
//     try {
//       const response = await axios.post(`${host}/api/student/get-student-by-date-name`, {
//         searchObj: {
//           examName: examDetails.examName,
//           examDate: examDetails.examDate
//         }
//       }, {
//         headers: {
//           accessToken: auth["user-credentials"].accessToken,
//           refreshToken: auth["user-credentials"].refreshToken,
//           email: auth["user-credentials"].user.email
//         }
//       });
//       // // console.log("students response:", response.data.payload);
//       setStudentsArr(response.data.payload);
//     } catch (error) {
//       // // console.log(error);
//     }
//   }

//   // const distributionForAnswerScripts = () => {
//   //   // // console.log(studentsArr, examinersArr)
//   //   const answerScriptPerPerson = Math.floor(studentsArr.length / examinersArr.length);
//   //   const remainingAnswerScripts = studentsArr.length % examinersArr.length;
//   //   // // console.log(answerScriptPerPerson, remainingAnswerScripts)
//   //   // const newArr = new Array(examinersArr.length).fill(answerScriptPerPerson);
//   //   const newArr = new Array(examinersArr.length);
//   //   // // console.log(examinersArr)
//   //   let sumIndex = 0;
//   //   for (let index = 0; index < newArr.length - 1; index++) {
//   //     newArr.push({
//   //       startUID: studentsArr[sumIndex].studentUID,
//   //       lastUID: studentsArr[sumIndex + answerScriptPerPerson].studentUID
//   //     });
//   //     sumIndex += answerScriptPerPerson;
//   //   }

//   //   newArr[examinersArr.length - 1] += remainingAnswerScripts;
//   //   // // console.log(newArr);
//   //   setDistributionArr(newArr);
//   // }

//   const distributionForAnswerScripts = () => {
//     // // console.log(studentsArr, examinersArr)
//     if (!studentsArr || !examinersArr) { return }
//     // // console.log(studentsArr, examinersArr)
//     const answerScriptPerPerson = Math.floor(studentsArr.length / examinersArr.length);
//     const remainingAnswerScripts = studentsArr.length % examinersArr.length;
//     // // console.log(answerScriptPerPerson, remainingAnswerScripts)

//     const newArr = new Array(examinersArr.length);
//     let startUID = 0;
//     // // console.log(studentsArr[startUID]?.studentUID)
//     for (let index = 0; index < newArr.length - 1; index++) {
//       //   // // console.log("in for", studentsArr[startUID])
//       newArr[index] = {
//         startUID: studentsArr[startUID]?.studentUID,
//         lastUID: studentsArr[startUID + answerScriptPerPerson - 1]?.studentUID,
//         total: answerScriptPerPerson
//       };
//       startUID += answerScriptPerPerson;
//     }

//     newArr[examinersArr.length - 1] = {
//       startUID: studentsArr[startUID]?.studentUID,
//       lastUID: studentsArr[startUID + remainingAnswerScripts - 1]?.studentUID,
//       total: remainingAnswerScripts + answerScriptPerPerson
//     };

//     // // console.log(newArr);
//     setDistributionArr(newArr);
//   }


//   const handleAllocationLimit = (e) => {
//     setAllocationLimit(e.target.value);
//   }

//   const handleAllocationSubmit = (e) => {
//     e.preventDefault();
//     distributionForAnswerScripts();
//   }

//   const handleExamDetailsSubmit = async (e) => {
//     e.preventDefault();
//     const tmpExam = await getExam();
//     // await getStudents();
//     distributionForAnswerScripts();
//   }

//   const handleSaveExam = async (e) => {
//     // // console.log('in save exam:', exam)

//     try {
//       const response = await axios.post(`${host}/api/exam/update/${exam._id}`, exam, {
//         headers: {
//           accessToken: auth["user-credentials"].accessToken,
//           refreshToken: auth["user-credentials"].refreshToken,
//           email: auth["user-credentials"].user.email
//         }
//       });
//       // // console.log('exam save changes:', response.data.payload)
//       setInvigilatorsArr(response.data.payload);
//       return response.data.payload;
//     } catch (error) {
//       // // console.log(error);
//       return null;
//     }
//   }
//   const handleChangeExam = (indexFloor, floorNumber, room) => {


//     const newExam = exam;
//     // newExam.examLocations = exam.examLocations.filter((ele, index) => index !== indexFloor);

//     // // console.log("new exam with ele not  changed",  newExam);

//     const tmpRooms = (exam.examLocations.find(ele => ele.floorNumber == floorNumber)).rooms;
//     // // console.log("fecthed room:", tmpRooms);

//     const newRooms = tmpRooms.filter(ele => ele.roomNumber !== room.roomNumber);
//     // // console.log("new rooms with no changes", newRooms)

//     // // console.log("room obj to be pushed:", room);
//     newRooms.push(room);
//     // // console.log(newRooms);
//     // // console.log("pushing newRooms[] to newExam.examLocations ", newExam, newExam.examLocations);
//     // // console.log("changed values: ", floorNumber, newRooms);
//     // newExam.examLocations.push({
//     //   floorNumber, rooms: newRooms
//     // })
//     for (let i = 0; i < newExam.examLocations.length; i++) {
//       if (newExam.examLocations[i].floorNumber == floorNumber) {
//         newExam.examLocations[i].rooms = newRooms;
//       }
//     }

//     // newExam.examLocations = newLocationsArr;
//     // // console.log("newExam: ", newExam);
//     setExam(newExam);

//   }
  
//   const getSortedFloors = (floors) => {
//     return floors.slice().sort((a, b) => {
//       const floorNumberA = parseInt(a.floorNumber, 10);
//       const floorNumberB = parseInt(b.floorNumber, 10);
//       return floorNumberA - floorNumberB;
//     });
//   };

//   const getSortedRooms = (rooms) => {
//     const sortedRooms = rooms.slice().sort((a, b) => {
//       // // console.log(a, b)
//       const roomNumberA = String(a?.roomNumber || '').toUpperCase();
//       const roomNumberB = String(b?.roomNumber || '').toUpperCase();

//       const isNumericA = /^\d+$/.test(roomNumberA);
//       const isNumericB = /^\d+$/.test(roomNumberB);

//       if (isNumericA && isNumericB) {
//         return parseInt(roomNumberA, 10) - parseInt(roomNumberB, 10);
//       } else if (isNumericA) {
//         return -1;
//       } else if (isNumericB) {
//         return 1;
//       } else {
//         return roomNumberA.localeCompare(roomNumberB, undefined, { numeric: true });
//       }
//     });
//     rooms = sortedRooms;
//     return sortedRooms;
//   };

//   return (
//     <div className='p-3 '>
//       <div className='heading mb-7'>
//         <h1 className='text-2xl font-semibold my-3'>Workspace</h1>
//         <div className='w-full h-[2px] bg-blue-500 rounded-md'></div>
//       </div>
//       {/* EXAM DETAILS */}
//       <div className='space-y-3'>
//         {
//           auth['user-credentials'].user.userType === 'ADMIN' &&
//           <>
//             <h2 className='text-xl font-medium '>Select the exam and date for retreiving exam details</h2>
//             <form id='searchExamForm' onSubmit={handleExamDetailsSubmit} className='space-y-2' >
//               <div className="examName flex gap-5 items-center">
//                 <label htmlFor="examName" className='w-[100px]'>Enter the Exam</label>
//                 <input type="text" name="examName" id="examName" value={examDetails.examName} onChange={handleExamDetails} className='w-[200px] border px-4 py-2 rounded-md' />
//               </div>
//               <div className="examDate flex gap-5 items-center">
//                 <label htmlFor="examDate" className='w-[100px]'>Enter the date</label>
//                 <input type="date" name="examDate" id="examDate" value={examDetails.examDate} className='w-[200px] border px-4 py-2 rounded-md' />
//               </div>
//               <div >
//                 <button className='px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600'>Search</button>
//               </div>
//             </form>
//             <hr className='my-3' />

//           </>
//         }

//         {/* EXAM DETAILS TABLE */}
//         {exam && <div className='text-base '>
//           <h3 className='text-xl font-medium my-6 '>Exam Details</h3>
//           <table className='w-full text-center border my-9'>
//             <thead className='text-center'>
//               <tr>

//                 <th className='border w-1/3'>Name</th>
//                 <th className='border w-1/3'>Date</th>
//                 <th className='border w-1/3'>Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className='border w-1/3'>{exam.examName}</td>
//                 <td className='border w-1/3'>{exam.examDate.substring(0, exam.examDate.lastIndexOf('T'))}</td>
//                 <td className='border w-1/3'>{exam.examTime}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>}

//       </div>
//       <hr />


//       {
//         (auth['user-credentials'].user.userType == 'ADMIN' || (auth['user-credentials'].user.userType == 'EXAM_OC' && (new Date()) < (new Date(exam?.examDate)))) ?
//           <div className='my-10'>

//             {/* ADD MEMBERS */}
//             <h2 className='text-xl font-medium my-2  pb-3 '>Add Members</h2>
//             <div className='members-container flex gap-3 items-center'>

//               {/* FOR USER_TYPE: - ADMIN | EXAM_OC */}
//               {/* CREATE SUPPORT_STAFFS */}
//               {
//                 (auth['user-credentials'].user.userType == 'ADMIN' || (auth['user-credentials'].user.userType == 'EXAM_OC' && (new Date()) < (new Date(exam?.examDate)))) ?
//                   <div className='create-support-staff'>
//                     <h4 className='text-[14px] font-medium '>Add Support staff</h4>
//                     <form id="addSupportStaff">
//                       <div className='py-2'>
//                         <label htmlFor="supportStaffFile"></label>
//                         <input type="file" name="supportStaffFile" id="supportStaffFile" />
//                       </div>
//                     </form>
//                   </div> : ''}

//               {/* CREATE EXAMINERS */}
//               {
//                 (auth['user-credentials'].user.userType === 'ADMIN') || (examinersArr.length === 0 && auth['user-credentials'].user.userType !== 'ADMIN') ?
//                   <div className='create-examiners '>
//                     <h4 className='text-[14px] font-medium '>Add Examiners</h4>
//                     <form id="addExaminers">
//                       <div className='py-2'>
//                         <label htmlFor="examiners"></label>
//                         <input type="file" name="examinersFile" id="examinersFile" />
//                       </div>
//                     </form>
//                   </div> : ''}

//               {/* CREATE INVIGLATORS */}
//               {
//                 (auth['user-credentials'].user.userType == 'ADMIN' || (auth['user-credentials'].user.userType == 'EXAM_OC' && (new Date()) < (new Date(exam?.examDate)))) ?
//                   <div className='create-invigilators '>
//                     <h4 className='text-[14px] font-medium '>Add Invigilators</h4>
//                     <form id="addInvigilators">
//                       <div className='py-2'>
//                         <label htmlFor="invigilatorsFile"></label>
//                         <input type="file" name="invigilatorsFile" id="invigilatorsFile" />
//                       </div>
//                     </form>
//                   </div> : ''}
//             </div>
//           </div> : ''}

//       <div className="my-7"><hr /></div>
//       {/* FOR USER_TYPE: - ADMIN | EXAMINER */}
//       {/* ANSWER-SCRIPT MARKS ASSIGNMENT */}
//       <div className='answer-script-marks-assignment my-7 '>

//       </div>

//       {/* FOR USER_TYPE: - ADMIN | EXAM_OC | SUPPORT_STAFF  */}
//       {/* ALLOCATION OF ANSWER-SCRIPTS */}
//       <div id="allocate-anaswer-script">
//         {/* ALLOCATE ANSWER-SCRIPT */}
//         <h2 className='text-xl font-medium '>Answer-Scripts Allocated Index</h2>


//         {/* EXAMINER DISPLAY */}
//         <h3 className="my-2">Examiners Available</h3>
//         <div id="examiner-display-container" className="examiner-display-container flex gap-3 my-3 overflow-x-auto">
//           {/* {
//               examinersArr.length === 0 ? <p>There are no examiners alloted!</p> :

//                 examinersArr.map((examiner, index) => (
//                   <ExaminerCard key={`examiner-${examiner._id}`} examiner={examiner} answerScripts={distributionArr[index]} />
//                 ))
//             } */}
//         </div>

//         {/* <form onSubmit={handleAllocationSubmit} id="allocate-scripts " className='my-7 flex gap-3 items-center'>
//           <div className="limit flex gap-3 items-center">
//             <label htmlFor="limit" className='w-[100px]'>Enter the limit</label>
//             <input type="number" name="limit" id="limt" value={allocationLimit} onChange={handleAllocationLimit} className="px-4 py-2 border border-slate-300 rounded-md" />
//           </div>
//           <div>
//             <button className='bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-md px-4 py-2 '>Allocate</button>
//           </div>
//         </form> */}

//       </div>
//       <hr />
//       {/* ANSWER-SCRIPT COUNTING TABLE */}
//       {
//         exam?.examLocations.length !== 0 &&
//         <div id="answer-script-counting" className="my-7 answer-script-counting h-[50vh] overflow-y-scroll">
//           <h2 className='text-xl font-medium '>Count the answer-scripts</h2>
//           <div className='border border-slate-400 min-w-[1047px] overflow-x-scroll'>
//             <div className="fields w-full flex border-b border-slate-400">
//               <p className="w-[16.66%] border-r border-slate-400 text-center py-2 text-[14px]">Floor</p>
//               <p className="w-[16.66%] border-r border-slate-400 text-center py-2 text-[14px]">Room</p>
//               <p className="w-[16.66%] border-r border-slate-400 text-center py-2 text-[14px]">Expected Scripts</p>
//               <p className="w-[16.66%] border-r border-slate-400 text-center py-2 text-[14px]">Actual Scripts</p>
//               <p className="w-[16.66%] border-r border-slate-400 text-center py-2 text-[14px]">Remarks</p>
//               <p className="w-[16.66%] text-center py-2 text-[14px]">Action</p>
//             </div>
//             <div className=''>

//               {
//                 exam && getSortedFloors(exam.examLocations).map((floor, i) => {
//                   return getSortedRooms(floor.rooms).map((room, j) => (
//                     <AnswerScriptCountingRow key={`row-${i + j}`} indexFloor={i} floorNumber={floor.floorNumber} room={room} handleChangeExam={handleChangeExam} handleSaveExam={handleSaveExam} />
//                   ))
//                 })
//               }



//             </div>
//           </div>

//         </div>}
//     </div>
//   )
// }

// export default Workspace
import React from 'react'

const Workspace = () => {
  return (
    <div>
      
    </div>
  )
}

export default Workspace
