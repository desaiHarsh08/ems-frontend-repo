import React from 'react'

const Loading = () => {
  return (
    <div id="loading" className="loading bg-slate-200 h-1 w-full overflow-hidden absolute top-0 left-0 right-0" >
        <div id="loading-bar" className='relative w-[10%] bg-blue-500 h-full rounded-md'></div>
    </div>
  )
}

export default Loading
