import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import ExamCard from './ExamCard';
// import { toogleSidebar } from '../../../app/features/sidebarToggleSlice';

const DashboardHome = () => {

    const location = useLocation();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const host = useSelector((state) => state.host.host);
    const loading = useSelector((state) => state.loadingStatus);
    const auth = useSelector((state) => state.auth);

    // // console.log(sidebarToogle)

    const examIds = JSON.parse(localStorage.getItem('examids'));
    // console.log(auth, examIds)



    const [examsObj, setExamsObj] = useState();
    const [examDone, setExamsDone] = useState([]);


    useEffect(() => {
        (async () => {
            try {
                // console.log(auth["user-credentials"].accessToken)
                // console.log(auth["user-credentials"].refreshToken)
                const examsData = await axios.get(
                    `${host}/api/exam/recent-upcoming-exams`,
                    {
                        headers: {
                            accessToken: auth["user-credentials"].accessToken,
                            refreshToken: auth["user-credentials"].refreshToken,
                            email: auth["user-credentials"].user.email
                        }
                    }
                );
                // console.log('in ef', examsData.data?.payload);
                setExamsObj(examsData.data?.payload);
            } catch (error) {
                // console.log(error);
            }
        })();


    }, []);

    const fetchUserByRecentExam = async () => {
        try {
            // console.log(auth["user-credentials"].accessToken)
            // console.log(auth["user-credentials"].refreshToken)
            const examsData = await axios.post(
                `${host}/api/common_role_assign/recent-user-exam`,
                {
                    examsArr: examsObj.recentExams
                },
                {
                    headers: {
                        accessToken: auth["user-credentials"].accessToken,
                        refreshToken: auth["user-credentials"].refreshToken,
                        email: auth["user-credentials"].user.email
                    }
                }
            );
            // console.log('in ef', examsData.data?.payload);
            setExamsObj(examsData.data?.payload);
        } catch (error) {
            // console.log(error);
        }
    }

    useEffect(() => {
        if (examsObj) {
            checkExams();
        }
        // console.log(examDone)
    }, [examsObj]);



    const isFloorAttendanceMarked = async (exam, floorNumber) => {
        try {
            // console.log('in isfloor', exam, floorNumber);
            const response = await axios.post(
                `${host}/api/exam_read_only/get-exam-obj-floor`,
                {
                    examName: exam.examName,
                    examDate: exam.examDate,
                    floorNumber: floorNumber,
                },
                {
                    headers: {
                        accessToken: auth["user-credentials"].accessToken,
                        refreshToken: auth["user-credentials"].refreshToken,
                        email: auth["user-credentials"].user.email
                    }
                }
            );
            return response.data.payload;
        } catch (error) {
            return null;
        }
    }

    const fetchFloorStatus = async (exam) => {
        let promises = exam.examLocations.map(async (location) => {
            let data = await isFloorAttendanceMarked(exam, location.floorNumber);
            // console.log(location, data);
            return data && data.length === location.rooms.length ? location.floorNumber : null;
        });

        let floorsDone = await Promise.all(promises);
        // console.log("floorsDone after promise all:", floorsDone);
        return floorsDone.filter((floor) => floor !== null);
    };

    const checkExams = async () => {
        const tmp = [];
        // console.log("in check exam before", examsObj)
        for (let i = 0; i < examsObj?.recentExams.length; i++) {
            const exam = examsObj.recentExams[i];
            const floorsDoneArr = await fetchFloorStatus(exam); // await the promise here
            // console.log("in check exam, ", floorsDoneArr)
            if (exam.examLocations.length === floorsDoneArr.length) {
                tmp.push(exam.examName);
            }
        }
        // console.log("Exams with all floors done:", tmp);
        // Set the state or do something with the tmp array
        setExamsDone(tmp)
    };

    return (
        <div className='text-[14px] w-[100%] overflow-hidden'>
            <div className='m-3'>
                <h1 className='text-xl sm:text-2xl uppercase font-semibold text-center sm:my-7 mb-7  sm:text-left '>Exam&nbsp; Attendance&nbsp; Management</h1>

                {/* RECENT EXAM(S) */}
                <div id="recent-exam" className={`w-full  px-3 ${examsObj && examsObj?.recentExams.length > 4 ? 'overflow-x-auto' : ''} `}>
                    <h2 className='text-xl font-semibold my-4'>Recent Exam(s)</h2>
                    <div id='recent-exam-container' className='flex flex-col items-center md:flex-row gap-5    '>
                        {
                            (examsObj && examsObj.recentExams?.length === 0) ?
                                <div className='py-3'>
                                    <p>Today there is no exam!</p>
                                </div> : '  '
                        }
{console.log(examsObj?.recentExams)}
                        {
                            examsObj && examsObj.recentExams?.map((exam, index) => {

                                if (
                                    (auth['user-credentials'].user.userType === 'ADMIN')
                                ) {
                                    return <ExamCard key={`recent-exam-${index}`} exam={exam} bgColor={examDone.includes(exam.examName) ? 'bg-green-400' : 'bg-orange-400'} examType={"RECENT"} />
                                }
                                else if (examIds.includes(exam._id)) {
                                    return <ExamCard key={`recent-exam-${index}`} exam={exam} bgColor={examDone.includes(exam.examName) ? 'bg-green-400' : 'bg-orange-400'} examType={"RECENT"} />

                                }

                            })
                        }





                    </div>
                </div>

            </div>
        </div >
    )
}

export default DashboardHome