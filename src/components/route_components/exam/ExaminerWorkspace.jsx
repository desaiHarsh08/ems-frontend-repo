import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import axios from 'axios';
import Swal from 'sweetalert2';

const ExaminerWorkspace = () => {

    const auth = useSelector((state) => state.auth);
    const host = useSelector((state) => state.host.host);
    const exam = (useSelector((state) => state.exam)).examSelected;

    const [isAllotmentRegistered, setIsAllotmentRegistered] = useState(false);

    const [dateCheck, setDateCheck] = useState();
    const [dateCheckFlag, setDateCheckFlag] = useState();
    const [dateMarksUpload, setDateMarksUpload] = useState();
    const [dateMarksUploadFlag, setDateMarksUploadFlag] = useState();


    const [allDone, setAllDone] = useState(false);

    const [allDoneObj, setAllDoneObj] = useState({dcFlag: false, muFlag: false});

    useEffect(() => {
        (async() => {
            try {
                const response = await axios.post(`${host}/api/common_role_assign/workprogress`,
                    {
                        _id: auth['user-credentials'].user._id
                    },
                    {
                        headers: {
                            accessToken: auth["user-credentials"].accessToken,
                            refreshToken: auth["user-credentials"].refreshToken,
                            email: auth["user-credentials"].user.email
                        }
                    }
                );
                console.log("response:", response.data.payload)
                console.log(response.data.payload.dateCheckingFlag)
                console.log(response.data.payload.marksUploadFlag)
                setDateCheckFlag(response.data.payload.dateCheckingFlag);
                setDateMarksUploadFlag(response.data.payload.marksUploadFlag);
                setAllDone(response.data.payload.dateCheckingFlag && response.data.payload.marksUploadFlag);
                setAllDoneObj({
                    dcFlag: response.data.payload.dateCheckingFlag,
                    muFlag: response.data.payload.marksUploadFlag
                })
    
            } catch (error) {
                console.log(error);
            }
        })();

        (async() => {
            try {
                console.log(
                    exam.examName,
                    exam.examDate,
                    auth['user-credentials'].user.from,
                    auth['user-credentials'].user.to,
                    auth['user-credentials'].user.total
                );
                const response = await axios.post(`${host}/api/student/get-students-allotment-register`,
                    {
                        examName: exam.examName,
                        examDate: exam.examDate,
                        fromRollNo: auth['user-credentials'].user.from,
                        toRollNo: auth['user-credentials'].user.to,
                        total: auth['user-credentials'].user.total,
                    },
                    {
                        headers: {
                            accessToken: auth["user-credentials"].accessToken,
                            refreshToken: auth["user-credentials"].refreshToken,
                            email: auth["user-credentials"].user.email
                        }
                    }
                );
                console.log("response:", response.data.payload)
                if(response.data.payload.length !== 0) {
                    setIsAllotmentRegistered(true);
                }
                else {
                    setIsAllotmentRegistered(false);
                }
            } catch (error) {
                console.log(error);
            }
        })();

    }, [allDone]);

    const exportToExcel = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        XLSX.writeFile(workbook, fileName);
    };

    const handleChangeCorrection = (e) => {
        if(allDoneObj.dcFlag === true) {return;}
        setDateCheckFlag(!dateCheckFlag);
    }

    const handleMarksUploadedDone = (e) => {
        if(allDoneObj.muFlag === true) {return;}
        setDateMarksUploadFlag(!dateMarksUploadFlag);
    }

    const handleAllotmentDownload = async (e) => {
        try {
            console.log(
                exam.examName,
                exam.examDate,
                auth['user-credentials'].user.from,
                auth['user-credentials'].user.to,
                auth['user-credentials'].user.total
            );
            const response = await axios.post(`${host}/api/student/get-students-allotment-register`,
                {
                    examName: exam.examName,
                    examDate: exam.examDate,
                    fromRollNo: auth['user-credentials'].user.from,
                    toRollNo: auth['user-credentials'].user.to,
                    total: auth['user-credentials'].user.total,
                },
                {
                    headers: {
                        accessToken: auth["user-credentials"].accessToken,
                        refreshToken: auth["user-credentials"].refreshToken,
                        email: auth["user-credentials"].user.email
                    }
                }
            );
            console.log("response:", response.data.payload)
            const data = [];
            for (let i = 0; i < response.data.payload.length; i++) {
                data.push({
                    "Sr no.": i + 1,
                    Name: response.data.payload[i].studentName,
                    "Roll no.": response.data.payload[i].studentUID,
                });
            }
            if(data.length === 0) {
                Swal.fire({
                    title: 'Alert',
                    text: 'No allotment registered for you...',
                    icon: 'info', // Options: 'success', 'error', 'warning', 'info'
                });
            }
            else {
                
                exportToExcel(data, "allotment_register.xlsx");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDateCheck = async (e) => {
        try {
            console.log(
                exam.examName,
                exam.examDate,
                auth['user-credentials'].user.from,
                auth['user-credentials'].user.to,
                auth['user-credentials'].user.total
            );
            const response = await axios.post(`${host}/api/common_role_assign/workprogress-dc`,
                {
                    examName: exam.examName,
                    examDate: exam.examDate,
                    dateChecking: dateCheck,
                    _id: auth['user-credentials'].user._id
                },
                {
                    headers: {
                        accessToken: auth["user-credentials"].accessToken,
                        refreshToken: auth["user-credentials"].refreshToken,
                        email: auth["user-credentials"].user.email
                    }
                }
            );
            console.log("response:", response.data.payload)
            Swal.fire({
                title: 'Alert',
                text: 'Marked the progress for paper checking...',
                icon: 'info', // Options: 'success', 'error', 'warning', 'info'
            });
                setDateCheckFlag(false);
                setAllDoneObj((prev)=>({...prev, dcFlag: true}));
        } catch (error) {
            console.log(error);
        }
    }

    const handleMarksUpload = async (e) => {
        try {
            const response = await axios.post(`${host}/api/common_role_assign/workprogress-mu`,
                {
                    examName: exam.examName,
                    examDate: exam.examDate,
                    dateMarksUpload: dateMarksUpload,
                    _id: auth['user-credentials'].user._id,
                },
                {
                    headers: {
                        accessToken: auth["user-credentials"].accessToken,
                        refreshToken: auth["user-credentials"].refreshToken,
                        email: auth["user-credentials"].user.email
                    }
                }
            );
            console.log("response:", response.data.payload)
            Swal.fire({
                title: 'Alert',
                text: 'Marked the progress for marks upload...',
                icon: 'info', // Options: 'success', 'error', 'warning', 'info'
            });
            setAllDoneObj((prev)=>({...prev, muFlag: true}));
         setDateMarksUploadFlag(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeDateCheck = async (e) => {
        if(allDone) { return;}
        setDateCheck(e.target.value);
    }

    const handleChangeDateMarksUpload = async (e) => {
        if(allDone) { return;}  
        setDateMarksUpload(e.target.value);
    }

    return (
        <div>
            {/* ALLOTMENT DOWNLOAD */}
            <h3 className='text-xl font-medium my-3'>Allotment register</h3>
            <button
                type='button'
                onClick={handleAllotmentDownload}
                className='px-4 py-2 bg-red-500 hover:bg-red-500 text-white rounded-md'
            >
                Download
            </button>

            {/* WORK PROGRESS */}
           {isAllotmentRegistered && <div>

                <h3 className='text-xl font-medium mt-9 my-3'>Work Progress</h3>

                <div class="flex items-center mb-4">
                    <input 
                        id="default-checkbox" 
                        type="checkbox" 
                        checked={dateCheckFlag || allDoneObj.dcFlag} 
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                        onChange={handleChangeCorrection} />
                    <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">All paper corrections are done</label>

                </div>
                {(dateCheckFlag && allDoneObj.dcFlag === false) &&  <div>
                    <input type="date" name="dateCheck" className='border border-slate-300 px-4 py-2 mr-2 rounded-md' value={dateCheck} onChange={handleChangeDateCheck} id="dateCheck" />
                    <button onClick={handleDateCheck}
                        className='px-4 py-2 bg-blue-500 hover:bg-blue-500 text-white rounded-md'>Save</button>
                </div>}

                <div class="flex items-center mt-10 mb-4">
                    <input 
                        id="default-checkbox" 
                        type="checkbox" 
                        checked={dateMarksUploadFlag || allDoneObj.muFlag} 
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                        onChange={handleMarksUploadedDone} />
                    <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Marks uploaded to CU Portal</label>
                </div>

                {(dateMarksUploadFlag  && allDoneObj.muFlag === false) &&  <div>
                    <input type="date" name="dateMarksUpload" required className='border border-slate-300 px-4 py-2 mr-2 rounded-md' value={dateMarksUpload} onChange={handleChangeDateMarksUpload} id="dateMarksUpload" />
                    <button onClick={handleMarksUpload} disabled={!dateMarksUploadFlag}
                        className='px-4 py-2 bg-blue-500 hover:bg-blue-500 text-white rounded-md'>Save</button>
                </div>}

            </div>}
        </div>
    )
}

export default ExaminerWorkspace
