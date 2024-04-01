import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { toggleLoadingStatus } from '../app/features/loadingSlice';
import axios from 'axios';
import { toogleSidebar } from '../app/features/sidebarToggleSlice';
import Exam from './Exam';

const CreateExam = () => {

    const dispatch = useDispatch();

    const host = useSelector((state) => state.host.host);
    const auth = useSelector((state) => state.auth);

    const [progressStatus, setProgressStatus] = useState(0);
    const [activityStatus, setActivityStatus] = useState('Initializing!');
    const [excelData, setExcelData] = useState([]); // For students data
    const [invigilatorsData, setInvigilatorsData] = useState([]); // For invgilators data
    const [supportStaffData, setSupportStaffData] = useState([]); // For support staff data
    const [examinersData, setExaminersData] = useState([]); // For examiners data
    const [exam, setExam] = useState({
        examName: '',
        examDate: new Date(),
        examTime: '',
        examLocations: [
            {
                rooms: []
            }
        ]
    });
    const [examOC, setExamOC] = useState({ username: '', email: '', userType: 'EXAM_OC', phone: '', examName: exam.examName, excelData: exam.examDate, examTime: exam.examTime });

    useEffect(()=> {
        dispatch(toogleSidebar());
    }, [])

    // FOR HANDLING FILE INPUT
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const dataFromFile = e.target.result;
                const workbook = XLSX.read(dataFromFile, { type: 'array' });
                const sheetName = workbook.SheetNames[0]; // Assumes the first sheet
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                setExcelData(data);
                // // console.log('Parsed Excel Data:', data);
            };
            reader.readAsArrayBuffer(file);
        }
    };
    const handleInvigilatorsFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const dataFromFile = e.target.result;
                const workbook = XLSX.read(dataFromFile, { type: 'array' });
                const sheetName = workbook.SheetNames[0]; // Assumes the first sheet
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                setInvigilatorsData(data);
                // // console.log('Parsed invgilators Data:', data);
            };
            reader.readAsArrayBuffer(file);
        }
    };
    const handleExaminersFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const dataFromFile = e.target.result;
                const workbook = XLSX.read(dataFromFile, { type: 'array' });
                const sheetName = workbook.SheetNames[0]; // Assumes the first sheet
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                setExaminersData(data);
                // console.log('Parsed examines Data:', data);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleSupportStaffFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const dataFromFile = e.target.result;
                const workbook = XLSX.read(dataFromFile, { type: 'array' });
                const sheetName = workbook.SheetNames[0]; // Assumes the first sheet
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                setSupportStaffData(data);
                // console.log('Parsed support staff Data:', data);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    // FORMAT THE EXAM OBJECT
    const formatExam = () => {
        const floors = Array.from(new Set(excelData.flat().map(ele => ele["Floor No."])));
        // console.log(floors)
        const uniqueRoomNumbers = Array.from(new Set(excelData.flat().map(ele => ele["Room No."])));
        // console.log("Unique Room Numbers:", uniqueRoomNumbers);
        // console.log(floors, uniqueRoomNumbers)
        const exmpt = [];
        for (let i = 0; i < floors.length; i++) {
            for (let j = 0; j < uniqueRoomNumbers.length; j++) {
                let floorStr = floors[i];
                const data = excelData.filter((ele) => (
                    ele !== undefined &&
                    ele["Floor No."] === floorStr &&
                    ele["Room No."] === uniqueRoomNumbers[j]
                ));
                // console.log(floorStr, uniqueRoomNumbers[j], data)
                if (data.length !== 0) {
                    // console.log(`${floorStr}, room-${uniqueRoomNumbers[j]}, data-${data}`)
                    let obj = {
                        floorNumber: Number(floors[i].charAt(0)),
                        rooms: []
                    }
                    obj.rooms.push({
                        roomNumber: uniqueRoomNumbers[j],
                        seatsArr: data.length,
                    })
                    exmpt.push(obj);
                }
            }
        }
        // console.log("done,", exmpt)
        const tmpSaved = exam;
        // console.log(tmpSaved)
        const all = []
        for (let i = 0; i < floors.length; i++) {
            let arr = exmpt.filter((ele) => (
                ele.floorNumber == Number(floors[i].charAt(0))
            ))
            // console.log(arr);
            all.push(arr)
        }
        // console.log(all)
        const newExmpt = [];
        for (let i = 0; i < all.length; i++) {
            let obj = {
                floorNumber: 1,
                rooms: []
            }
            for (let j = 0; j < all[i].length; j++) {
                obj.floorNumber = all[i][j].floorNumber
                obj.rooms.push(all[i][j].rooms[0])
            }
            newExmpt.push(obj);
        }
        tmpSaved.examLocations = newExmpt;

        // console.log(tmpSaved);

        for (let i = 0; i < tmpSaved.examLocations.length; i++) {
            for (let j = 0; j < tmpSaved.examLocations[i].rooms.length; j++) {
                // // console.log(tmpSaved.examLocations[i].rooms[j])
                tmpSaved.examLocations[i].rooms[j]["answerScript"] = {
                    expected: tmpSaved.examLocations[i].rooms[j].seatsArr.length,
                    actual: tmpSaved.examLocations[i].rooms[j].seatsArr.length,
                    remarks: '',
                }
            }
        }
        // console.log(tmpSaved);

        

        setExam((prev) => ({
            ...prev,
            examLocations: exmpt,
        }));

        return tmpSaved;
    }

    const convertToAMPM = (time24) => {
        let hour = parseInt(time24.substring(0, 2));
        let minute = time24.substring(3);
    
        let period = (hour >= 12) ? "PM" : "AM";
    
        hour = (hour > 12) ? hour - 12 : hour;
        hour = (hour === 0) ? 12 : hour;
    
        return `${hour}:${minute} ${period}`;
    }

    // SCHEDULE AN EXAM
    const scheduleExam = async () => {
        const examObj = formatExam();
        setActivityStatus('Creating Exam!');

        let examTime = convertToAMPM(exam.examTime);
        // console.log(exam.examTime.substring(0, 2));
        // if(Number(exam.examTime.substring(0, exam.examTime.indexOf(':'))) == 12) { // For 12:00 PM
        //     examTime = `${Number(exam.examTime.substring(0, exam.examTime.indexOf(':')))}:${exam.examTime.substring(exam.examTime.indexOf(':') + 1)} PM`;
        // }
        // if(Number(exam.examTime.substring(0, exam.examTime.indexOf(':'))) > 12) { // For greater than 12:00 PM
        //     console.log(exam.examTime, exam.examTime.length, Number(exam.examTime.substring(0, exam.examTime.indexOf(':'))));
        //     examTime = `${Number(exam.examTime.substring(0, exam.examTime.indexOf(':'))) - 12}:${exam.examTime.substring(exam.examTime.indexOf(':') + 1)} PM`;
        // }
        // else {
        //     examTime = `${Number(exam.examTime.substring(0, exam.examTime.indexOf(':')))}:${exam.examTime.substring(exam.examTime.indexOf(':') + 1)} AM`;
        // }
        console.log("examTime before scheduling: ", examTime);
        try {
            const res = await axios.post(`${host}/api/exam/create`,
                { ...examObj, examTime },
                {
                    headers: {
                        accessToken: auth["user-credentials"].accessToken,
                        refreshToken: auth["user-credentials"].refreshToken,
                        email: auth["user-credentials"].user.email
                    }
                }
            );
            return res.data.payload;
        } catch (error) {
            // console.log(error);
            Swal.fire({
                title: 'Alert',
                text: 'Exam already got scheduled...!',
                icon: 'error', // Options: 'success', 'error', 'warning', 'info'
            });
            document.getElementById('progress-container').classList.toggle('invisible');
            return false;
        }
    }

    // UPLOAD THE EXAMINERS 
    const uploadExaminersData = async (examId, examTime) => {

        const examinersObjArr = [];
        setActivityStatus('Uploading examiners!')
        for (let i = 0; i < examinersData.length; i++) {
            examinersObjArr.push({
                username: examinersData[i]["Name of Examiner"],
                email: examinersData[i]["Email"],
                userType: "EXAMINER",
                phone: examinersData[i]["Mobile"],
                examName: exam.examName,
                examDate: exam.examDate,
                examTime: examTime,
                examId: examId,
                paperChecking: {
                    lastDateChecking: examinersData[i]["Last Date of Paper Checking"],
                    lastDateMarksUpload: examinersData[i]["Last Date of Marks Upload"],
                },
                dateChecking: '',
                dateMarksUpload: ''
            });
        }

        for (let i = 0; i < examinersObjArr.length; i++) {
            try {
                const res = await axios.post(`${host}/api/common_role_assign/create`,
                    examinersObjArr[i],
                    {
                        headers: {
                            accessToken: auth["user-credentials"].accessToken,
                            refreshToken: auth["user-credentials"].refreshToken,
                            email: auth["user-credentials"].user.email
                        }
                    }
                );
            } catch (error) {
                // console.log(error);
            }
            setProgressStatus((((i+1)*100)/examinersObjArr.length).toFixed(1));
        }
    }

    // UPLOAD THE INVIGILATORS
    const uploadInvigilatorsData = async (examId, examTime) => {
        // console.log(invigilatorsData, exam);
        setActivityStatus('Uploading invigilators!');
        const invigilatorsObjArr = [];
        for (let i = 0; i < invigilatorsData.length; i++) {
            invigilatorsObjArr.push({
                username: invigilatorsData[i]["Name of Invigilators"],
                email: invigilatorsData[i]["Email"],
                userType: "INVIGILATOR",
                phone: invigilatorsData[i]["Mobile"],
                examName: exam.examName,
                examDate: exam.examDate,
                examTime: examTime,
                examId: examId,
                roomNumber: invigilatorsData[i]["Room no"]
            });
        }

        for (let i = 0; i < invigilatorsObjArr.length; i++) {
            try {
                const res = await axios.post(`${host}/api/common_role_assign/create`,
                    invigilatorsObjArr[i],
                    {
                        headers: {
                            accessToken: auth["user-credentials"].accessToken,
                            refreshToken: auth["user-credentials"].refreshToken,
                            email: auth["user-credentials"].user.email
                        }
                    }
                );
                // console.log("invigilators uploaded", res.data.payload)
            } catch (error) {
                // console.log(error);
            }
            setProgressStatus((((i+1)*100)/invigilatorsObjArr.length).toFixed(1));
        }
    }

    // UPLOAD THE SUPPORT_STAFF
    const uploadSupportStaffData = async (examId, examTime) => {
        // console.log(supportStaffData, exam);
        setActivityStatus('Uploading support staff!');
        const supportStaffObjArr = [];
        for (let i = 0; i < supportStaffData.length; i++) {
            supportStaffObjArr.push({
                username: supportStaffData[i]["Name of Support staff"],
                email: supportStaffData[i]["Email"],
                userType: "SUPPORT_STAFF",
                phone: supportStaffData[i]["Mobile"],
                examName: exam.examName,
                examDate: exam.examDate,
                examTime,
                examId
            });
        }

        for (let i = 0; i < supportStaffObjArr.length; i++) {
            try {
                const res = await axios.post(`${host}/api/common_role_assign/create`,
                    supportStaffObjArr[i],
                    {
                        headers: {
                            accessToken: auth["user-credentials"].accessToken,
                            refreshToken: auth["user-credentials"].refreshToken,
                            email: auth["user-credentials"].user.email
                        }
                    }
                );
                // console.log("suppor staff added:", res.data.payload)
            } catch (error) {
                // console.log(error);
            }
            setProgressStatus((((i+1)*100)/supportStaffObjArr.length).toFixed(1));
        }
    }

    // UPLOAD THE EXAM_OC
    const uploadExamOC = async (examId, examTime) => {
        // console.log(examOC, exam);
        try {
            const res = await axios.post(`${host}/api/common_role_assign/create`,
                {
                    username: examOC.username,
                    email: examOC.email,
                    userType: examOC.userType,
                    phone: examOC.phone,
                    examName: exam.examName,
                    examDate: exam.examDate,
                    examTime,
                    examId
                },
                {
                    headers: {
                        accessToken: auth["user-credentials"].accessToken,
                        refreshToken: auth["user-credentials"].refreshToken,
                        email: auth["user-credentials"].user.email
                    }
                }
            );
        } catch (error) {
            // console.log(error);
        }

    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (exam.examName == '' || exam.examDate == '') {
            Swal.fire({
                title: 'Alert',
                text: 'Please fill all the fields...!',
                icon: 'error', // Options: 'success', 'error', 'warning', 'info'
            });
            return;
        }

        if (examOC.username == '' || examOC.email == '' || examOC.phone == '') {
            Swal.fire({
                title: 'Alert',
                text: 'Please provide the Exam OC...!',
                icon: 'error', // Options: 'success', 'error', 'warning', 'info'
            });
            return;
        }

        if (excelData == null || excelData.length === 0) {
            Swal.fire({
                title: 'Alert',
                text: 'Please upload the student data.',
                icon: 'error', // Options: 'success', 'error', 'warning', 'info'
            });
            return;
        }


        document.getElementById('progress-container').classList.toggle('invisible');

        
        let examTime = convertToAMPM(exam.examTime);
        // if(Number(exam.examTime.substring(0, 2)) === 12) { // For 12:00 PM
        //     examTime = `${Number(exam.examTime.substring(0, exam.examTime.indexOf(':')))}:${exam.examTime.substring(exam.examTime.indexOf(':') + 1)} PM`;
        // }
        // if(Number(exam.examTime.substring(0, 2)) > 12) { // For greater than 12:00 PM
        //     console.log(exam.examTime, exam.examTime.length, Number(exam.examTime.substring(0, exam.examTime.indexOf(':'))));
        //     examTime = `${Number(exam.examTime.substring(0, exam.examTime.indexOf(':'))) - 12}:${exam.examTime.substring(exam.examTime.indexOf(':') + 1)} PM`;
        // }
        // else {
        //     examTime = `${Number(exam.examTime.substring(0, exam.examTime.indexOf(':')))}:${exam.examTime.substring(exam.examTime.indexOf(':') + 1)} AM`;
        // }
        

        const examCreated = await scheduleExam();

        if (!examCreated) { return; }

        setActivityStatus('Assigning Exam OC!');
        await uploadExamOC(examCreated._id, examTime);

        if (examinersData.length !== 0) {
            await uploadExaminersData(examCreated._id, examTime);
        }

        if (invigilatorsData.length !== 0) {
            await uploadInvigilatorsData(examCreated._id, examTime);
        }

        if (supportStaffData.length !== 0) {
            await uploadSupportStaffData(examCreated._id, examTime);
        }

        setActivityStatus('Uploading students!');
        var s = 0;
        dispatch(toggleLoadingStatus());
        // console.log(excelData.length)
        
        for (let i = 0, s = 0; i < excelData.length; i++) {
            const res = await axios.post(`${host}/api/student/create`, {
                studentName: excelData[i]["Name"],
                studentUID: excelData[i]["UID"],
                examDetails: {
                    examName: excelData[i]["Exam Name"],
                    examDate: exam.examDate,
                    examTime: examTime,
                    floorNumber: isNaN(Number(excelData[i]["Floor No."]?.substring(0, 1))) ? 0 : Number(excelData[i]["Floor No."]?.substring(0, 1)),
                    roomNumber: excelData[i]["Room No."],
                    seatNumber: excelData[i]["Seat No."],
                },
                isPresent: true,
                email: auth["user-credentials"].user.email
            },
                {
                    headers: {
                        accessToken: auth["user-credentials"].accessToken,
                        refreshToken: auth["user-credentials"].refreshToken,
                        email: auth["user-credentials"].user.email
                    }
                }
            )
            // console.log(i + 1, ((i + 1) * 100 / excelData.length));
            setProgressStatus(((i + 1) * 100 / excelData.length).toFixed(1));
        }

        document.getElementById('progress-container').classList.toggle('invisible');

        Swal.fire({
            title: 'Alert',
            text: 'Exam scheduled successfully...!',
            icon: 'success', // Options: 'success', 'error', 'warning', 'info'
        });
        console.log(exam)
    }

    // HANDLE THE CHANGES IN THE EXAM
    const handleChange = (e) => {
        let { name, value } = e.target;
        console.log(exam.examTime, `${name}: ${value}`);
        setExam((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // HANDLE THE CHANGES IN THE EXAM_OC
    const handleExamOCChange = (e) => {
        const { name, value } = e.target;
        setExamOC((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    return (
        <div id='create-exam' className='create-exam h-full  m-3 text-[14px]'>
            <div className='heading'>
                <h1 className='text-2xl font-semibold my-3'>Create Exam</h1>
                <div className='w-full h-[2px] bg-blue-500 rounded-md'></div>
            </div>

            {/* CREATE THE EXAM */}
            <div className='my-9'>
                <h2 className='text-xl font-medium flex my-7'>
                    <span className='w-20'>Step 1:</span>
                    <span>Create the exam</span>
                </h2>
                <form className='space-y-3' onSubmit={handleSubmit}>
                    <div className='examName flex gap-2 sm:items-center flex-col sm:flex-row'>
                        <label htmlFor="examName" className='min-w-[200px]' >Exam Name</label>
                        <input type="text" value={exam.examName} onChange={handleChange} id='examName' name='examName' className='min-w-input border border-slate-500 rounded-md px-4 py-2' />
                    </div>
                    <div className='examDate flex gap-2 sm:items-center flex-col sm:flex-row'>
                        <label htmlFor="examDate" className='min-w-[200px]'>Exam Date</label>
                        <input type="date" value={exam.examDate} onChange={handleChange} id='examDate' name='examDate' className=' border border-slate-500 min-w-input rounded-md px-4 py-2' />
                    </div>
                    <div className='examTime flex gap-2 sm:items-center flex-col sm:flex-row'>
                        <label htmlFor="examTime" className='min-w-[200px]'>Exam Time</label>
                        <input type="time" value={exam.examTime} onChange={handleChange} id='examTime' name='examTime' className='  border border-slate-500 min-w-input rounded-md px-4 py-2' />
                    </div>

                    {/* INPUT THE FILE CONTAINING THE EXAM_OC DETAILS */}
                    <div className='w-full '>
                        <h2 className='text-xl font-medium flex mt-14'>
                            <span className='w-20'>Step 2:</span>
                            <span>Add the Exam OC</span>
                        </h2>
                        <div className='w-full my-3 flex flex-col sm:flex-row sm:items-center gap-2'>
                            <label htmlFor="username" className='min-w-[200px] block'  >Enter the name</label>
                            <input type="text" name='username' id='username' value={examOC.username} onChange={handleExamOCChange} className='px-4 py-2 border rounded-md border-slate-400 min-w-[200px]' placeholder='Enter the username...' />
                        </div>
                        <div className='w-full my-3 flex flex-col sm:flex-row sm:items-center gap-2'>
                            <label htmlFor="email" className='min-w-[200px] block'  >Enter the email</label>
                            <input type="email" name='email' id='email' value={examOC.email} onChange={handleExamOCChange} className='px-4 py-2 border rounded-md border-slate-400 min-w-[200px]' placeholder='Enter the email...' />
                        </div>
                        <div className='w-full my-3 flex flex-col sm:flex-row sm:items-center gap-2'>
                            <label htmlFor="phone" className='min-w-[200px] block'  >Enter the phone</label>
                            <input type="text" name='phone' id='phone' value={examOC.phone} onChange={handleExamOCChange} className='px-4 py-2 border rounded-md border-slate-400 min-w-[200px]' placeholder='Enter the phone...' />
                        </div>
                    </div>

                    {/* ADD MEMBERS */}
                    <div className=' pt-7'>
                        <h2 className='my-7 text-xl font-medium '>Add Members (Can be added before the date of examination)</h2>
                        <div className='flex add-members-container gap-5'>
                            {/* INPUT THE FILE CONTAINING THE INVIGILATORS DETAILS */}
                            <div className='add-members-card w-1/3'>
                                <h2 className='text-xl font-medium flex '>
                                    <span className='w-20'>Step 3:</span>
                                    <span>Add the Invigilators</span>
                                </h2>
                                <div className='w-full my-3'>
                                    <label htmlFor="inputFileInvigilators" ></label>
                                    <input type="file" name='inputFileInvigilators' id='inputFileInvigilators' accept=".xlsx, .xls" onChange={handleInvigilatorsFileUpload} />
                                </div>
                            </div>

                            {/* INPUT THE FILE CONTAINING THE SUPPORT_STAFF DETAILS */}
                            <div className='add-members-card w-1/3'>
                                <h2 className='text-xl font-medium flex '>
                                    <span className='w-20 '>Step 4:</span>
                                    <span>Add the Support staff</span>
                                </h2>
                                <div className='w-full my-3'>
                                    <label htmlFor="inputFileSupportStaff" ></label>
                                    <input type="file" name='inputFileSupportStaff' id='inputFileSupportStaff' accept=".xlsx, .xls" onChange={handleSupportStaffFileUpload} />
                                </div>
                            </div>

                            {/* INPUT THE FILE CONTAINING THE EXAMINERS DETAILS */}
                            <div className='add-members-card w-1/3'>
                                <h2 className='text-xl font-medium flex '>
                                    <span className='w-20'>Step 5:</span>
                                    <span>Add the Examiners</span>
                                </h2>
                                <div className='w-full my-3'>
                                    <label htmlFor="inputFileExaminers" ></label>
                                    <input type="file" name='inputFileExaminers' id='inputFileExaminers' accept=".xlsx, .xls" onChange={handleExaminersFileUpload} />
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* INPUT THE FILE CONTAINING THE STUDENTS DETAILS */}
                    <div>
                        <h2 className='text-xl font-medium flex mt-14'>
                            <span className='w-20'>Step 6:</span>
                            <span>Add the students</span>
                        </h2>
                        <div id="input-file" className='w-full my-3'>
                            <label htmlFor="inputFile" ></label>
                            <input type="file" name='inputFile' id='inputFile' accept=".xlsx, .xls" onChange={handleFileUpload} />
                        </div>
                    </div>

                    {/* PROGRESS STATUS */}
                    <div className='py-20'>
                        <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded-md'>Create</button>
                    </div>
                </form>
            </div>

            <div id="progress-container" className="invisible progress-container absolute bottom-7 left-0 right-0 flex justify-center items-center">
                <div className='border flex flex-col gap-2 p-5 bg-purple-500 text-white font-medium rounded-md '>
                    <span>{activityStatus}</span>
                    <div className="flex gap-2">
                    <span>Completed&nbsp;:</span>
                    <span>{progressStatus}%</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CreateExam
