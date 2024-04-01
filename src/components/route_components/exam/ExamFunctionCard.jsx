import React from 'react'


const ExamFunctionCard = ({handleExamFunctionClick, label, icon, bgColor}) => {
  return (
    <div onClick={()=>{handleExamFunctionClick(label)}} className={`${bgColor} text-white font-medium w-[250px] border text-xl border-slate-300 h-[150px] rounded-md shadow-md flex gap-2 justify-center items-center cursor-pointer`}>
        {icon}
        <span>{label}</span>
    </div>
  )
}

export default ExamFunctionCard
