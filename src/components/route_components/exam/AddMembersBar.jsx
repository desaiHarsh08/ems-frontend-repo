import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { parse } from 'date-fns';

const AddMembersBar = ({ toogleAddMembersBar, setToogleAddMembersBar, labelAddMembersBar }) => {

    const auth = useSelector((state) => state.auth);
    const host = useSelector((state) => state.host.host);
    const exam = (useSelector((state) => state.exam)).examSelected;
    // console.log(exam)
    const [progressStatus, setProgressStatus] = useState(0);
    const [excelData, setExcelData] = useState([]);
    const [membersArr, setMembersArr] = useState([]);

    useEffect(() => {
        (async () => {
            let userType = '';
            console.log(labelAddMembersBar)
            if (labelAddMembersBar.toLowerCase().includes('examiner')) {
                userType = "EXAMINER"
            }
            else if (labelAddMembersBar.toLowerCase().includes('support_staff')) {
                userType = "SUPPORT_STAFF"
            }
            else if (labelAddMembersBar.toLowerCase().includes('invigilator')) {
                userType = "INVIGILATOR"
            }

            const res = await axios.post(`${host}/api/common_role_assign/get-by-role-name-date`, {

                examName: exam.examName,
                examDate: exam.examDate,
                userType

            }, {
                headers: {
                    'Content-Type': 'application/json',
                    accessToken: auth["user-credentials"].accessToken,
                    refreshToken: auth["user-credentials"].refreshToken,
                    email: auth["user-credentials"].user.email
                }
            });
            let dataArr = res.data.payload;
            let tmpArr = [];
            for(let i = 0; i < dataArr.length; i++) {
                if(tmpArr.some(ele => ele.email === dataArr[i].email)) {
                    continue;
                }
                else {
                    tmpArr.push(dataArr[i]);
                }
            }
            setMembersArr(tmpArr);

        })();
    }, [labelAddMembersBar]);


    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataFromFile = e.target.result;
                const workbook = XLSX.read(dataFromFile, { cellDates: true, type: 'array' });
                const sheetName = workbook.SheetNames[0]; // Assumes the first sheet
                const worksheet = workbook.Sheets[sheetName];

                // Modify the option to parse dates with the format 'dd-mm-yyyy'
                const data = XLSX.utils.sheet_to_json(worksheet, { raw: true, dateNF: 'dd-mm-yyyy' });
                setExcelData(data);
                console.log('Parsed Excel Data:', data);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const getInfo = () => {
        if (labelAddMembersBar.toLowerCase() === "add examiners") {
            return { columnName: 'Name of Examiner', userType: 'EXAMINER' };
        }
        else if (labelAddMembersBar.toLowerCase() === "add support staff") {
            return { columnName: 'Name of Support staff', userType: 'SUPPORT_STAFF' };
        }
        else if (labelAddMembersBar.toLowerCase() === "add invigilator") {
            return { columnName: 'Name of Invigilators', userType: 'INVIGILATOR' };
        }
    }

    const handleUploadAddMembers = async (e) => {
        e.preventDefault();
        const file = document.getElementById('add-member-file').files[0];
        if (!file) {
            Swal.fire({
                title: 'Alert',
                text: 'Please provide the file...!',
                icon: 'error', // Options: 'success', 'error', 'warning', 'info'
            });
        }

        // const excelData = await extractFileData(file);
        // console.log(excelData);

        // FORMAT THE DATA IN REQUIRED OBJECT ACCEPTED BY THE BACKEND SCRIPT
        const formatedData = [];
        for (let i = 0; i < excelData.length; i++) {
            let memberObj = {
                username: excelData[i][getInfo().columnName],
                email: excelData[i]["Email"],
                userType: getInfo().userType,
                phone: excelData[i]["Mobile"],
                examName: exam.examName,
                examDate: exam.examDate,
                examTime: exam.examTime,
                examId: exam._id
            };
            if (getInfo().userType === 'INVIGILATOR') {
                memberObj["roomNumber"] = excelData[i]["Room no"];
            }
            if (getInfo().userType === 'EXAMINER') {



                memberObj["from"] = '';
                memberObj["to"] = '';
                memberObj["total"] = 0;

                const tmpLastDateChecking = new Date(excelData[i]["Last Date of Paper Checking"]);
                const tmpLastDateMarksUpload = new Date(excelData[i]["Last Date of Marks Upload"]);

                memberObj["paperChecking"] = {
                    lastDateChecking: `${(tmpLastDateChecking.getDate() + 1).toString().padStart(2, '0')}-${(tmpLastDateChecking.getMonth() + 1).toString().padStart(2, '0')}-${tmpLastDateChecking.getFullYear()}`,
                    lastDateMarksUpload: `${(tmpLastDateMarksUpload.getDate() + 1).toString().padStart(2, '0')}-${(tmpLastDateMarksUpload.getMonth() + 1).toString().padStart(2, '0')}-${tmpLastDateMarksUpload.getFullYear()}`
                };


            }
            formatedData.push(memberObj);
        }
        console.log(formatedData);

        document.getElementById('progress-container').classList.toggle('invisible');
        // UPLOAD THE MEMBERS: -
        for (let i = 0; i < formatedData.length; i++) {
            try {
                const response = await axios.post(`${host}/api/common_role_assign/create`,
                    formatedData[i],
                    {
                        headers: {
                            accessToken: auth["user-credentials"].accessToken,
                            refreshToken: auth["user-credentials"].refreshToken,
                            email: auth["user-credentials"].user.email
                        }
                    }
                );
                console.log("members uploaded", response.data.payload)
            } catch (error) {
                console.log(error);
            }
            let ps = (((i + 1) * 100) / formatedData.length).toFixed(1);
            setProgressStatus(ps);
        }
        document.getElementById('progress-container').classList.toggle('invisible');
        handleCloseAddMemberBar();
    }

    const handleCloseAddMemberBar = () => {
        console.log('fired');
        setToogleAddMembersBar(false);
    }

    return (
        <>
            <div className={`w-[45vh] md:w-1/3 flex gap-[4px] space-y-2  z-10 absolute top-0 ${!toogleAddMembersBar ? 'translate-x-[1000px] hidden' : ''} top-0 right-0 bottom-0 transition-all duration-300`}>
                <div id="close-add-members-bar" className="close-add-members-bar w-12 flex justify-center py-1 text-4xl">
                    <div className='hover:bg-slate-50 border border-blue-400 h-12 w-12 flex justify-center bg-white cursor-pointer items-center'>
                        <button className='' onClick={handleCloseAddMemberBar}><IoCloseSharp /></button>
                    </div>
                </div>
                <div className="add-members-bar-container bg-white h-full border border-slate-400 p-3" >
                    <div className='my-7 pb-1 border-b-2 border-blue-500'>
                        <h3 className=' text-center text-xl font-medium'>{labelAddMembersBar}</h3>
                    </div>
                    <form onSubmit={handleUploadAddMembers}>
                        <input type="file" name='file' id='add-member-file' onChange={handleFile} className='my-2' />
                        <button className=' my-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium'>Upload</button>
                    </form>
                    {/* <p className='my-3'>Available: 0</p> */}

                    <div className='template-info'>
                        <p className='my-3 font-medium'>NOTE: -</p>
                        <ol style={{ listStyle: '1' }} className='space-y-4'>
                            <li className='flex gap-2'>
                                <p>1.</p>
                                <p>The file to be uploaded must be in XLSX format.</p>
                            </li>
                            <li className='flex gap-2'>
                                <p>2.</p>
                                <p>
                                    <p>The file should contain the following columns with precise names:</p>
                                    <ul className='ml-2 my-1'>
                                        {
                                            labelAddMembersBar === "Add Examiners" &&
                                            <>
                                                <li>Name of Examiner</li>
                                                <li>Last Date of Paper Checking</li>
                                                <li>Last Date of Marks Upload</li>
                                            </>
                                        }
                                        {
                                            labelAddMembersBar === "Add support staff" &&
                                            <li>Name of Support staff</li>
                                        }
                                        {
                                            labelAddMembersBar === "Add invigilator" &&
                                            <>
                                                <li>Name of Invigilators</li>
                                                <li>Room No</li>
                                            </>
                                        }
                                        <li>Email</li>
                                        <li>Mobile</li>
                                    </ul>
                                </p>
                            </li>
                        </ol>
                    </div>

                    {/* Members Information */}
                    <div className='my-7'>
                        {
                            membersArr.length > 0 ?
                                <>
                                <p className='text-[16px] my-3 font-medium'>Members available: -</p>
                                {membersArr.map((member, index) => (
                                    <p className='my-1'>
                                        <span>{index + 1}. </span>
                                        <span>{member.username}</span>
                                    </p>
                                    ))}
                                </>
                                : <p className='text-[16px] my-3 font-medium'>No members got assigned!</p>
                        }
                    </div>

                </div>
            </div>

            <div id="progress-container" className="invisible progress-container absolute bottom-7 left-0 right-0 flex justify-center items-center">
                <div className='border flex flex-col gap-2 p-5 bg-purple-500 text-white font-medium rounded-md '>
                    <div className="flex gap-2">
                        <span>Completed&nbsp;:</span>
                        <span>{progressStatus}%</span>
                    </div>
                </div>
            </div>
        </>

    )
}

export default AddMembersBar
