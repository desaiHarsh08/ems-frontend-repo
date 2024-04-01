import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const AllotAnswerScript = () => {

    const dispatch = useDispatch();

    const host = useSelector((state) => state.host.host);
    const auth = useSelector((state) => state.auth);
    const exam = (useSelector((state) => state.exam)).examSelected;

    const [examinersArr, setExaminersArr] = useState();
    const [studentsArr, setStudentsArr] = useState();
    const [isLoaded, setIsLoaded] = useState(false);
    const [stats, setStats] = useState({
        totalStudents: 0,
        distributed: 0,
        left: 0
    })

    const [allotedArr, setAllotedArr] = useState([{
        total: 0,
        from: '',
        to: '',
        examinerEmail: ''
    }])

    useEffect(() => {
        // if(!examinersArr || !studentsArr) {
        //     fetchExaminers();
        //     fetchStudents();
        // }

        const fetchData = async () => {
            await fetchExaminers();
            await fetchStudents();
        };

        if (!examinersArr || !studentsArr) {
            fetchData();
        }

    }, [examinersArr, studentsArr]);


    const fetchExaminers = async () => {
        const res = await axios.post(`${host}/api/common_role_assign/get-by-role-name-date`, { userType: 'EXAMINER', examName: exam.examName, examDate: exam.examDate }, {
            headers: {
                'Content-Type': 'application/json',
                accessToken: auth["user-credentials"].accessToken,
                refreshToken: auth["user-credentials"].refreshToken,
                email: auth["user-credentials"].user.email
            }
        });
        console.log(res.data.payload);
        setExaminersArr(res.data.payload)
    }


    const fetchStudents = async () => {
        setIsLoaded(true);
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
        const dataArr = res.data.payload;
        console.log(dataArr)
        // for (let i = 0; i < dataArr.length; i++) {
        //     if (dataArr[i].studentUID.length < 10) {
        //         dataArr[i].studentUID = dataArr[i].studentUID.padStart(10, 0);
        //     }
        // }
        let distributed = 0;
        if (!examinersArr) { return; }

        let totalAnswerScripts = 0;
        for (let i = 0; i < exam.examLocations.length; i++) {
            let floor = exam.examLocations[i];
            let rooms = floor.rooms;
            for (let j = 0; j < rooms.length; j++) {
                console.log("in allot as loop, room:", rooms[j]);
                console.log(`totalAnswerSciprts = ${totalAnswerScripts} + ${rooms[j].answerScript.actual}`);
                totalAnswerScripts += rooms[j].answerScript.actual;
            }
        }
        console.log("totalAnswerScripts:", totalAnswerScripts)

        for (let i = 0; i < examinersArr.length; i++) {
            if (Number(examinersArr[i].total)) {
                distributed += Number(examinersArr[i].total);
            }
        }

        console.log("initial:", { totalStudents: totalAnswerScripts, distributed, left: dataArr.length - distributed })
        setStats({ totalStudents: totalAnswerScripts, distributed, left: totalAnswerScripts - distributed });

        setStudentsArr(dataArr);
        setIsLoaded(false);
    }

    const updateExaminers = async (examiner) => {
        try {
            const res = await axios.post(`${host}/api/common_role_assign/updated-examiner`, examiner, {
                headers: {
                    'Content-Type': 'application/json',
                    accessToken: auth["user-credentials"].accessToken,
                    refreshToken: auth["user-credentials"].refreshToken,
                    email: auth["user-credentials"].user.email
                }
            });
            console.log(res.data.payload);
            return res.data.payload;
        } catch (error) {
            return null;
        }
    }

    const handleUpdateExaminers = async () => {
        console.log(examinersArr);
        for (let i = 0, count = 0; i < examinersArr.length; i++) {
            if (await updateExaminers(examinersArr[i])) {
                count++;
            }
        }
        Swal.fire({
            title: 'Alert',
            text: 'Alloted the answer-scripts to the examiners...!',
            icon: 'success', // Options: 'success', 'error', 'warning', 'info'
        });
    }

    const handleChange = (e, index) => {
        const newExaminers = [...examinersArr];

        if (e.target.name == 'total') {
            newExaminers[index].total = e.target.value;
        }

        let sum = 0;
        for (let i = 0; i < newExaminers.length; i++) {
            if (Number(newExaminers[i].total)) {
                sum += Number(newExaminers[i].total);
            }
        }

        if (sum > studentsArr?.length) {
            Swal.fire({
                title: 'Alert',
                text: 'Total exceeds the limit for the available answer-scripts...!',
                icon: 'error', // Options: 'success', 'error', 'warning', 'info'
            });
            return;
        }

        let distributed = 0;
        for (let i = 0, startIndex = 0; i < newExaminers.length; i++) {
            if (newExaminers[i].total == 0) {
                newExaminers[i].from = '';
                newExaminers[i].to = '';
                continue;
            }
            if (!Number(newExaminers[i].total)) {
                continue;
            }
            distributed += Number(newExaminers[i].total);
            console.log(startIndex, startIndex + Number(newExaminers[i].total))
            newExaminers[i].from = studentsArr[startIndex].studentUID;
            newExaminers[i].to = studentsArr[startIndex + Number(newExaminers[i].total) - 1].studentUID;
            startIndex += Number(newExaminers[i].total);
        }

        setStats((prev) => ({ ...prev, distributed, left: studentsArr.length - distributed }));





        setExaminersArr(newExaminers);
    }

    return (
        <div className='pb-20 w-full '>
            <h2 className='my-3 mb-7 text-xl font-medium'>Allot the answer-scripts</h2>
            {examinersArr && examinersArr?.length !== 0 && <div className="stats flex gap-2 my-4">
                <div className=" stats-card font-medium space-y-2 py-3 text-center border rounded-md border-slate-300 w-1/3">
                    <p className='text-xl'>{!isLoaded ? stats.totalStudents : '...'}</p>
                    <p>Total Students</p>
                </div>
                <div className=" stats-card font-medium space-y-2 py-3 text-center border rounded-md border-slate-300 w-1/3">
                    <p className='text-xl'>{!isLoaded ? stats.distributed : '...'}</p>
                    <p>Distributed</p>
                </div>
                <div className=" stats-card font-medium space-y-2 py-3 text-center border rounded-md border-slate-300 w-1/3">
                    <p className='text-xl'>{!isLoaded ? stats.left : '...'}</p>
                    <p>Left</p>
                </div>
            </div>}

            <div className='w-full overflow-x-auto'>

                {
                    examinersArr && examinersArr?.length !== 0 ?
                        <>
                            <div className="table min-w-[1250px] mt-7 rounded-md">
                                <div className="thead w-full flex border-2 border-slate-400">
                                    <p className='w-[16.66%] text-center py-2 border-r-2 border-slate-400'>Name</p>
                                    <p className='w-[16.66%] text-center py-2 border-r-2 border-slate-400'>Email</p>
                                    <p className='w-[16.66%] text-center py-2 border-r-2 border-slate-400'>Phone</p>
                                    <p className='w-[16.66%] text-center py-2 border-r-2 border-slate-400'>From</p>
                                    <p className='w-[16.66%] text-center py-2 border-r-2 border-slate-400'>To</p>
                                    <p className='w-[16.66%] text-center py-2 '>Total</p>
                                </div>
                                <div className="tbody border-2 border-t-transparent border-slate-400">
                                    {
                                        examinersArr.length !== 0 &&
                                        examinersArr.map((examiner, index) => (
                                            <div className="tr flex ">
                                                <p className='w-[16.66%] text-center py-2 border-r-2 border-slate-400'>{examiner.username}</p>
                                                <p className='w-[16.66%] text-center py-2 border-r-2 border-slate-400'>{examiner.email}</p>
                                                <p className='w-[16.66%] text-center py-2 border-r-2 border-slate-400'>{examiner.phone}</p>
                                                <p className='w-[16.66%] text-center py-2 border-r-2 border-slate-400'>{examiner.from}</p>
                                                <p className='w-[16.66%] text-center py-2 border-r-2 border-slate-400'>{examiner.to}</p>
                                                <input type='number' onChange={(e) => { handleChange(e, index) }} name='total' value={examiner.total} placeholder='to roll no...' className='outline-none w-[16.66%] text-center py-2 ' />
                                            </div>
                                        ))
                                    }

                                </div>
                            </div>

                            {/* Save the data */}
                            <div className='my-4'>
                                <button onClick={handleUpdateExaminers} className='px-4 py-2 bg-red-500 text-white rounded-md font-medium'>Save</button>
                            </div>
                        </>
                        : <p>There are no examiners assigned for this exam</p>
                }
            </div>


        </div>
    )
}

export default AllotAnswerScript
