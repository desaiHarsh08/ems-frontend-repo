import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import ExamCard from '../components/route_components/dashboard/ExamCard';
import { tooglePreviousExam } from '../app/features/previousExamSlice';

const PreviousExams = () => {

    const location = useLocation();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const host = useSelector((state) => state.host.host);
    const loading = useSelector((state) => state.loadingStatus);
    const auth = useSelector((state) => state.auth);
    const previousExamFlag = useSelector((state) => state.previousExamFlag).previousExamFlag;
    console.log(previousExamFlag);

    // // console.log(sidebarToogle)

    const examIds = JSON.parse(localStorage.getItem('examids'));
    // console.log(auth, examIds)


    const [examsArr, setExamsArr] = useState([]);
    const [examsObj, setExamsObj] = useState();
    const [examDone, setExamsDone] = useState([]);


    useEffect(() => {
        (async () => {
            try {
                // console.log(auth["user-credentials"].accessToken)
                // console.log(auth["user-credentials"].refreshToken)
                const response = await axios.get(
                    `${host}/api/exam/get-all`,
                    {
                        headers: {
                            accessToken: auth["user-credentials"].accessToken,
                            refreshToken: auth["user-credentials"].refreshToken,
                            email: auth["user-credentials"].user.email
                        }
                    }
                );
                console.log('in ef', response.data.payload);
                setExamsArr(response.data?.payload);
            } catch (error) {
                console.log(error);
            }
        })();
        

    }, []);

    useEffect(() => {
        const userType = auth["user-credentials"].user.userType.toUpperCase();
        console.log("in previous exam,", userType);

        if (!["ADMIN", "EXAM_OC"].includes(userType)) {
            navigate('/dashboard', {replace: true});
        }
        
        // if(auth["user-credentials"].user.userType.toUpperCase() !== "ADMIN" || 
        // auth["user-credentials"].user.userType.toUpperCase() !== "EXAM_OC") {
        //     navigate('/dashboard', {replace: true});
        // }
        
    }, [])

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
        console.log(examDone)
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
        console.log("Exams with all floors done:", tmp);
        // Set the state or do something with the tmp array
        setExamsDone(tmp)
    };

    return (
        <div className='text-[14px] w-[100%] overflow-hidden'>
            <div className='m-3'>
                <h1 className='text-xl sm:text-2xl uppercase font-semibold text-center sm:my-7 mb-7  sm:text-left '>Exam&nbsp; Attendance&nbsp; Management</h1>
                {/* <span>TODO</span> */}
                {/* PREVIOUS EXAM(S) */}
                <div id="upcoming-exams" className='my-7'>
                    <h2 className='text-xl font-semibold'>Previous Exams</h2>
                    {examsArr?.length == 0 ?
                        <div className='py-3'>
                            <p>No previous exams found!</p>
                        </div> : ''
                    }
                    {console.log(examsArr)}
                    {
                        examsArr?.length != 0 ?
                            <div id='exams-cards' className='flex min-w-[90vw] overflow-x-auto my-3 gap-2' >
                                {
                                    examsArr?.map((exam, index) => {
                                        if(auth['user-credentials'].user.userType === 'ADMIN') {
                                            return <ExamCard key={`upcoming-exam-${index}`} exam={exam} bgColor={'bg-blue-500'} examType={"UPCOMING"} />

                                        }
                                        else if(auth['user-credentials'].user.userType !== 'ADMIN' && examIds.includes(exam._id)) {
                                            return <ExamCard key={`upcoming-exam-${index}`} exam={exam} bgColor={'bg-blue-500'} examType={"UPCOMING"} />
                                        }
                                        else {
                                            return '';
                                        }
                                    })
                                }
                            </div>
                            : ''
                    }
                </div>
            </div>
        </div >
    )
}

export default PreviousExams
