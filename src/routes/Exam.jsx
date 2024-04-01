import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ExamFunctionCard from '../components/route_components/exam/ExamFunctionCard'
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaMarker } from "react-icons/fa6";
import { GrCircleInformation } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import { IoMdPersonAdd } from "react-icons/io";
import { IoIosPersonAdd } from "react-icons/io";
import { IoPersonAddOutline } from "react-icons/io5";
import { BsFillCollectionFill } from "react-icons/bs";
import { MdOutlineBallot } from "react-icons/md";
import AddMembersBar from '../components/route_components/exam/AddMembersBar';
import AnswerScriptCountingRow from '../components/route_components/exam/AnswerScriptCountingRow';
import { setExam, setExamActual, updateExam } from '../app/features/examSlice';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import AllotAnswerScript from '../components/route_components/exam/AllotAnswerScript';
import ExaminerWorkspace from '../components/route_components/exam/ExaminerWorkspace';

const Exam = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const host = useSelector((state) => state.host.host);
    const auth = useSelector((state) => state.auth);

    const floorNumber = (useSelector((state) => state.floorNumber)).floorNumber;
    const roomNumber = (useSelector((state) => state.roomNumber)).roomNumber;
    const exam = (useSelector((state) => state.exam)).examSelected;

    const [dateTimeString, setDateTimeString] = useState(`${exam.examDate} ${exam.examTime.toString().substring(0, 9)}`);

    const [toogleExamFunctionsDisplay, setToogleExamFunctionsDisplay] = useState(true);
    const [tooglAttendanceDisplay, setToogleAttendanceDisplay] = useState(false);
    const [toogleCollectAnswerScriptDisplay, setToogleCollectAnswerScriptDisplay] = useState(false);
    const [toogleAssignMarksDisplay, setToogleAssignMarksDisplay] = useState(false);
    const [toogleAddMembersBar, setToogleAddMembersBar] = useState(false);
    const [toogleAllot, setToogleAllot] = useState(false);
    const [labelAddMembersBar, setLabelAddMembersBar] = useState('');

    const [studentsArr, setStudentsArr] = useState([]);

    useEffect(() => {
        if (auth['user-credentials'].user.userType == 'INVIGILATOR') {
            setToogleAttendanceDisplay(true);
            setToogleExamFunctionsDisplay(false);
        }
        else if (auth['user-credentials'].user.userType == 'EXAMINER') {
            setToogleAssignMarksDisplay(true);
            setToogleExamFunctionsDisplay(false);
        }
    }, []);

    // Fetch all the students
    useEffect(() => {
        (async () => {
            const res = await axios.post(`${host}/api/student/get-student-by-date-name`, {
                searchObj: {
                    examName: exam.examName,
                    examDate: exam.examDate
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    accessToken: auth["user-credentials"].accessToken,
                    refreshToken: auth["user-credentials"].refreshToken,
                    email: auth["user-credentials"].user.email
                }
            });
            let dataArr = res.data.payload;
            // console.log(dataArr)
            setStudentsArr(dataArr);
            
            // console.log("students available:",dataArr.length)

        })();
    }, []);

    const floorNav = () => {
        document.getElementById('bread-crumb').classList.toggle('invisible');
        navigate(`/dashboard/${exam._id}`, { replace: true });
    }

    const roomNav = () => {
        document.getElementById('roomNav').classList.toggle('hidden');
        navigate(`/dashboard/${exam._id}/floor-${roomNumber}`, { replace: true });
    }

    const handleExamFunctionClick = async (label) => {
        // console.log(label);
        if ((label.toLowerCase() === "add examiners") || (label.toLowerCase() === "add support staff") || (label.toLowerCase() === "add invigilator")) {
            setToogleAddMembersBar(true);
            setLabelAddMembersBar(label)
        }

        else if (label.toLowerCase() === "mark attendance") {
            // console.log("dateTimeString:", dateTimeString);
            const dateTime = new Date(dateTimeString);
            const currentDate = new Date();
            // console.log(auth['user-credentials'].user.userType)

            if (auth['user-credentials'].user.userType !== 'ADMIN') {
                // console.log("currentDate:", currentDate)
                // console.log("dateTime:", dateTime)
                // console.log("currentDate >= dateTime =", currentDate >= dateTime);
                if (currentDate >= dateTime) {
                    setToogleAttendanceDisplay(true);
                    setToogleExamFunctionsDisplay(false);
                    setToogleCollectAnswerScriptDisplay(false);
                }
                else {
                    Swal.fire({
                        title: 'Alert',
                        text: 'Attendance mode will be enabled during the exam time...',
                        icon: 'info', // Options: 'success', 'error', 'warning', 'info'
                    });
                }
            }
            else {
                setToogleAttendanceDisplay(true);
                setToogleExamFunctionsDisplay(false);
                setToogleCollectAnswerScriptDisplay(false);
            }

        }
        else if (label.toLowerCase() === "collect answer script") {
            setToogleCollectAnswerScriptDisplay(true);
            setToogleExamFunctionsDisplay(false);
            setToogleAttendanceDisplay(false);
        }
        else if (label.toLowerCase() === "allot answer script") {
            setToogleExamFunctionsDisplay(false);
            setToogleAllot(true)
        }
        else if (label.toLowerCase() === "exam report") {
            await handleExamReport();
        }
        else if (label.toLowerCase() === "display_functions") {
            setToogleCollectAnswerScriptDisplay(false);
            setToogleExamFunctionsDisplay(true);
            setToogleAttendanceDisplay(false);
            setToogleAllot(false);
        }
    }

    const handleSaveExam = async (e, exam) => {
        // console.log('fired')
        try {
            // console.log("saving")
            // console.log(exam.examLocations[0].rooms)
            const response = await axios.post(`${host}/api/exam/update/${exam._id}`, exam, {
                headers: {
                    accessToken: auth["user-credentials"].accessToken,
                    refreshToken: auth["user-credentials"].refreshToken,
                    email: auth["user-credentials"].user.email
                }
            });
            // console.log("saved")
            // console.log(response.data.payload)
            dispatch(setExamActual({ exam }));
            return response.data.payload;
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    const handleChangeExam = (indexFloor, floorNumber, room) => {
        dispatch(updateExam({ indexFloor, floorNumber, room }));
    }

    const getSortedFloors = (floors) => {
        return floors.slice().sort((a, b) => {
            const floorNumberA = parseInt(a.floorNumber, 10);
            const floorNumberB = parseInt(b.floorNumber, 10);
            return floorNumberA - floorNumberB;
        });
    };

    const getSortedRooms = (rooms) => {
        const sortedRooms = rooms.slice().sort((a, b) => {
            // // console.log(a, b)
            const roomNumberA = String(a?.roomNumber || '').toUpperCase();
            const roomNumberB = String(b?.roomNumber || '').toUpperCase();

            const isNumericA = /^\d+$/.test(roomNumberA);
            const isNumericB = /^\d+$/.test(roomNumberB);

            if (isNumericA && isNumericB) {
                return parseInt(roomNumberA, 10) - parseInt(roomNumberB, 10);
            } else if (isNumericA) {
                return -1;
            } else if (isNumericB) {
                return 1;
            } else {
                return roomNumberA.localeCompare(roomNumberB, undefined, { numeric: true });
            }
        });
        rooms = sortedRooms;
        return sortedRooms;
    };

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


    const handleExamReport = async (e) => {
        const response = await axios.post(`${host}/api/student/get-student-by-date-name`,
            {
                searchObj: {
                    examName: exam.examName,
                    examDate: exam.examDate
                }
            },
            {
                headers: {
                    accessToken: auth["user-credentials"].accessToken,
                    refreshToken: auth["user-credentials"].refreshToken,
                    email: auth["user-credentials"].user.email
                }
            }
        );
        exportToExcelAttendance(response.data.payload, `${exam.examDate}-${exam.examName}.xlsx`);
        handleSubmitExamStats()
    }

    const handleSubmitExamStats = async (e) => {
        const response = await axios.post(`${host}/api/student/get-student-stats-date-name`,
            {
                examName: exam.examName,
                examDate: exam.examDate
            },
            {
                headers: {
                    accessToken: auth["user-credentials"].accessToken,
                    refreshToken: auth["user-credentials"].refreshToken,
                    email: auth["user-credentials"].user.email
                }
            }
        )
        exportToExcelStats(response.data.payload, `${exam.examDate}-${exam.examName}-stats.xlsx`);

    }

    return (
        <div className='p-2 h-full'>
            {/* EXAM DETAILS */}
            <div className='text-base h-40'>
                <h3 className='text-xl font-semibold my-6 uppercase'>Exam Details</h3>
                <table className='w-full text-center border my-9'>
                    <thead className='text-center'>
                        <tr>

                            <th className='border w-1/3'>Name</th>
                            <th className='border w-1/3'>Date</th>
                            <th className='border w-1/3'>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='border w-1/3'>{exam.examName}</td>
                            <td className='border w-1/3'>{exam.examDate.toString().substring(0, 10)}</td>
                            <td className='border w-1/3'>{exam.examTime.toString().substring(0, 9)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {

            }
            {toogleExamFunctionsDisplay === true && auth['user-credentials'].user.userType !== 'INVIGILATOR' ?
                <>
                    {/* EXAM FUNCTIONS */}
                    <div className=' flex flex-wrap justify-center items-center gap-5 h-[65vh] sm:h-[50vh] overflow-y-auto md:overflow-y-hidden'>
                        {/* ADD MEMBERS */}
                        <ExamFunctionCard handleExamFunctionClick={handleExamFunctionClick} label={"Add Examiners"} icon={<IoMdPersonAdd />} bgColor={'bg-red-500'} />
                        <ExamFunctionCard handleExamFunctionClick={handleExamFunctionClick} label={"Add support staff"} icon={<IoIosPersonAdd />} bgColor={'bg-yellow-400'} />
                        <ExamFunctionCard handleExamFunctionClick={handleExamFunctionClick} label={"Add invigilator"} icon={<IoPersonAddOutline />} bgColor={'bg-purple-500'} />

                        {/* MARK ATTENDANCE */}
                        <ExamFunctionCard handleExamFunctionClick={handleExamFunctionClick} label={"Mark Attendance"} icon={<FaMarker />} bgColor={'bg-green-500'} />

                        {/* ANSWER SCRIPTS */}
                        <ExamFunctionCard handleExamFunctionClick={handleExamFunctionClick} label={"Collect Answer script"} icon={<BsFillCollectionFill />} bgColor={'bg-blue-500'} />
                        <ExamFunctionCard handleExamFunctionClick={handleExamFunctionClick} label={"Allot Answer script"} icon={<MdOutlineBallot />} bgColor={'bg-blue-500'} />

                        {/* EXAM REPORT */}
                        <ExamFunctionCard handleExamFunctionClick={handleExamFunctionClick} label={"Exam Report"} icon={<IoMdDownload />} bgColor={'bg-orange-500'} />

                    </div>

                    {/* ADD MEMBERS BAR (FLOATING) */}
                    <AddMembersBar toogleAddMembersBar={toogleAddMembersBar} setToogleAddMembersBar={setToogleAddMembersBar} labelAddMembersBar={labelAddMembersBar} />

                </> :
                <div>
                    {
                        auth['user-credentials'].user.userType !== 'EXAMINER' &&
                        <button onClick={() => { handleExamFunctionClick('display_functions') }} className='bg-slate-200 pl-1 pr-2 py-2 rounded-md '>Exam Functions</button>}
                </div>
            }


            {/* BREAD-CRUMB */}

            {
                !toogleExamFunctionsDisplay && tooglAttendanceDisplay ?
                    <div id='bread-crumb' className=' flex rounded-md my-1'>

                        <ul className={`${location.pathname.includes(`/dashboard/${exam._id}/floor-${floorNumber}`) ? 'bg-slate-300' : ''} text-slate-500 text-[14px] p-1 flex gap-2`}>
                            {console.log("url:", location.pathname, "window:", window.location.href)}
                            {window.location.href.includes(`#/dashboard/${exam._id}/floor-${floorNumber}`) ?
                                <>
                                    <li id='floorNav'>
                                        <p className='cursor-pointer' onClick={floorNav} to={`/dashboard/${exam._id}`} >Floors</p>
                                    </li>
                                    <li><span>/</span></li>


                                </>
                                : ''}
                            {
                                window.location.href.endsWith(`/dashboard/${exam._id}/floor-${floorNumber}/room-${roomNumber}`) ?
                                    <>
                                        <li id='roomNav'>
                                            <p className='cursor-pointer' onClick={roomNav} to={`/dashboard/${exam._id}/floor-${floorNumber}`} >Rooms</p>
                                        </li>
                                    </> : ""
                            }
                        </ul>
                    </div> : ''}

            {
                toogleAssignMarksDisplay &&
                    <ExaminerWorkspace />
            }
            {
                tooglAttendanceDisplay ?
                    <div className="exam-locations-container border h-[50vh] overflow-y-auto">
                        <Outlet />
                    </div> : ''}





            {/* ANSWER-SCRIPT COUNTING TABLE */}
            {console.log(toogleCollectAnswerScriptDisplay)}
            {
                toogleCollectAnswerScriptDisplay === true && exam?.examLocations.length !== 0 &&
                <div id="answer-script-counting" className="my-7 answer-script-counting h-[50vh] overflow-y-scroll">
                    <h2 className='text-xl font-medium '>Count the answer-scripts</h2>
                    <div className='border border-slate-400 min-w-[1047px] overflow-x-scroll'>
                        <div className="fields w-full flex border-b border-slate-400">
                            <p className="w-[14.28%] border-r border-slate-400 text-center py-2 text-[14px]">Floor</p>
                            <p className="w-[14.28%] border-r border-slate-400 text-center py-2 text-[14px]">Room</p>
                            <p className="w-[14.28%] border-r border-slate-400 text-center py-2 text-[14px]">Alloted</p>
                            <p className="w-[14.28%] border-r border-slate-400 text-center py-2 text-[14px]">Attended</p>
                            <p className="w-[14.28%] border-r border-slate-400 text-center py-2 text-[14px]">Actually received</p>
                            <p className="w-[14.28%] border-r border-slate-400 text-center py-2 text-[14px]">Remarks</p>
                            <p className="w-[14.28%] text-center py-2 text-[14px]">Action</p>
                        </div>
                        <div className=''>

                            {
                                exam && getSortedFloors(exam.examLocations).map((floor, i) => {
                                    return getSortedRooms(floor.rooms).map((room, j) => (
                                        <AnswerScriptCountingRow
                                            key={`row-${i + j}`}
                                            studentsArr={studentsArr}
                                            indexFloor={i}
                                            floorNumber={floor.floorNumber}
                                            room={room}
                                            handleChangeExam={handleChangeExam}
                                            handleSaveExam={handleSaveExam}
                                        />
                                    ))
                                })
                            }



                        </div>
                    </div>

                </div>}


            {/* ALLOT ANSWER-SCRIPT */}
            {
                toogleAllot === true ?
                    <AllotAnswerScript />
                    : ''
            }

        </div>
    )
}

export default Exam