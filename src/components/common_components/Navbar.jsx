import React from 'react'
import { useDispatch } from 'react-redux';
import { toogleNavbar, toogleSidebar } from '../../app/features/sidebarToggleSlice';

const Navbar = () => {

  const dispatch = useDispatch();

  const handleClick = () => {
    // const bar1 = document.getElementById('bar1');
    // const bar2 = document.getElementById('bar2');
    // const bar3 = document.getElementById('bar3');

    // bar1.classList.toggle('translate-y-2');
    // bar1.classList.toggle('rotate-45');
    // bar1.classList.toggle('bg-black');
    // bar1.classList.toggle('bg-red-500');

    // bar2.classList.toggle('invisible')

    // bar3.classList.toggle('-translate-y-2');
    // bar3.classList.toggle('-rotate-45');
    // bar3.classList.toggle('bg-black');
    // bar3.classList.toggle('bg-red-500');

    dispatch(toogleNavbar());
    dispatch(toogleSidebar())
    

  }

 
  return (
    <div className='bg-slate-200 h-full w-full flex justify-between items-center px-2' id='navbar'>
      <img src="/logo.webp" alt="logo" className='w-12 h-12 rounded-full' />
      <div id="hmbrg" onClick={handleClick}>
        <div id="bar1" className='w-7 h-1 bg-black rounded-md transition-all duration-150'></div>
        <div id="bar2" className='w-7 h-1 bg-black rounded-md my-1 '></div>
        <div id="bar3" className='w-7 h-1 bg-black rounded-md transition-all duration-150'></div>
      </div>
    </div>
  )
}

export default Navbar
