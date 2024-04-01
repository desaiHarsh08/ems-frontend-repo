import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setExam } from '../../../app/features/examSlice';

const ExamCard = ({ exam, bgColor, examType }) => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const auth = useSelector((state) => state.auth);

    const examIds = JSON.parse(localStorage.getItem('examids'));

    const handleExamClick = (exam) => {
        // if (examType !== 'RECENT') { return; }
        if (auth['user-credentials'].user?.userType !== 'ADMIN' && (examIds.indexOf(exam._id) == -1)) {
            alert(`examId: ${exam._id}\nuser examid: ${auth['user-credentials'].user?.examId}`);
            return;
        }
        // console.log(exam)
        dispatch(setExam({ exam }));
        navigate(`/dashboard/${exam._id}`, { replace: true });
    }

    return (
        <>
            {

                <div onClick={() => { handleExamClick(exam) }} className="exam hover:cursor-pointer w-[250px] h-[150px] flex flex-col border border-slate-300 hover:shadow-lg rounded-md">
                    <div className={`h-[40%] flex justify-center items-center font-medium text-white  ${bgColor}`} style={{width: '250px'}}>
                        <h3 className="exam-name text-[18px] ">{exam.examName}</h3>
                    </div>
                    <div className='h-[60%] flex justify-center items-center '>
                        <ul className='w-full h-full flex justify-center items-center'>
                            <li className='w-full flex flex-col justify-center items-center'>
                                <div className='flex w-full '>
                                    <p className='w-1/2 text-center'>Date</p>
                                    <p className='w-1/2 text-center'>{exam.examDate.toString().substring(0, 10)}</p>
                                </div>
                                <div className='flex w-full'>
                                    <p className='w-1/2 text-center'>Time</p>
                                    <p className='w-1/2 text-center'>{exam.examTime.toString().substring(0, 9)}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>}
        </>
    )
}

export default ExamCard