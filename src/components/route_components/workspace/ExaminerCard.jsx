import React from 'react'

const ExaminerCard = ({examiner, answerScripts }) => {
  return (
    <div className='h-[100px] w-[250px] shadow-sm border border-slate-300 rounded-md flex flex-col justify-center items-center'>
        <p className='text-xl my-1'>{examiner.username}</p>
        {/* <p>{examiner.email}</p>
        <p>{examiner.phone}</p> */}
        
        <p>{answerScripts?.startUID.padStart(10, '0')}- {answerScripts?.lastUID?.padStart(10, '0')}</p>
        <p className='text-xl'>{answerScripts?.total}</p>
    </div>
  )
}

export default ExaminerCard