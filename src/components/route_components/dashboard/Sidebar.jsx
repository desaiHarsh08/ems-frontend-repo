import React, { useEffect } from 'react'
import { IoHomeSharp } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaEye } from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri";
import { MdLibraryBooks } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { toogleNavbar, toogleSidebar } from '../../../app/features/sidebarToggleSlice';
import { TbBrandNextjs } from "react-icons/tb";
import { BiSolidSkipPreviousCircle } from "react-icons/bi";

const Sidebar = () => {

    const location = useLocation();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const host = useSelector((state) => state.host.host);
    const auth = useSelector((state) => state.auth);
    const loading = useSelector((state) => state.loadingStatus);

    // // console.log(auth, auth["user-credentials"].user.userType)

    const handleLogout = () => {
        localStorage.clear();
        navigate('/', { replace: true });
    }

    const handleLink = (link) => {
        if (link === '/') {
            localStorage.clear();
        }
        dispatch(toogleSidebar());
        dispatch(toogleNavbar());
        navigate(`${link}`, { replace: true });
    }



    return (
        <div className={`w-full h-full bg-slate-600 borde text-slate-600 flex flex-col items-center justify-between transition-all duration-150 `}>
            <div>

                <div className='flex flex-col items-center'>
                    <h2 className='text-xl font-medium my-3 text-white'>Welcome</h2>
                    <div className='h-32 w-32 rounded-full'>
                        <img src={localStorage.getItem('picture')} alt="user-profile" className='w-full h-full rounded-full' />
                    </div>
                    <p className='text-white my-3 text-[16px]'>{auth['user-credentials'].user.username}</p>
                </div>
                <ul className='py-10 space-y-2'>
                    <li>
                        <p onClick={() => { handleLink('/dashboard') }} className={`cursor-pointer text-[14px] flex items-center gap-2 ${location.pathname.endsWith('/dashboard') ? 'text-[#00ffff]' : 'text-white'}`}>
                            <IoHomeSharp />
                            <span>Home</span>
                        </p>
                    </li>
                    <li>
                        <p onClick={() => { handleLink('upcoming-exams') }} className={`cursor-pointer text-[14px] flex items-center gap-2 ${location.pathname.endsWith('upcoming-exams') ? 'text-[#00ffff]' : 'text-white'}`}>
                        <TbBrandNextjs />
                            <span>Upcoming Exam</span>
                        </p>
                    </li>
                    <li>
                        <p onClick={() => { handleLink('previous-exams') }} className={`cursor-pointer text-[14px] flex items-center gap-2 ${location.pathname.endsWith('previous-exams') ? 'text-[#00ffff]' : 'text-white'}`}>
                        <BiSolidSkipPreviousCircle />
                            <span>Previous Exam</span>
                        </p>
                    </li>
                    {
                        auth['user-credentials'].user.userType === 'ADMIN' ?
                            <li>
                                <p onClick={() => { handleLink('create-exam') }} className={`cursor-pointer text-[14px] flex items-center gap-2 ${location.pathname.endsWith('create-exam') ? 'text-[#00ffff]' : 'text-white'}`}>
                                    <IoAddOutline />
                                    <span>Create Exam</span>
                                </p>
                            </li> : ''}
                    {
                        (auth['user-credentials'].user.userType === 'ADMIN' || auth['user-credentials'].user.userType === 'EXAM_OC') ?
                            <li>
                                <p onClick={() => { handleLink('exam-report') }} className={`cursor-pointer text-[14px] flex items-center gap-2 ${location.pathname.endsWith('view-attendance') ? 'text-[#00ffff]' : 'text-white'}`}>
                                    <FaEye />
                                    <span>Exam Report</span>
                                </p>
                            </li> : ''}
                    <li onClick={() => { handleLink('/') }} className='pt-7 my-7 cursor-pointer'>
                        <div className={`text-[14px] flex items-center gap-2 text-white`}>
                            <RiLogoutBoxFill />
                            <span>Logout</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div className=' w-full h-14 text-white flex justify-center items-center px-2 gap-2 '>
                {/* <img src={localStorage.getItem('picture')} alt="profile" className='w-14 h-14 rounded-full border' /> */}
                <span>v2.0.1</span>
            </div>
        </div>
    )
}

export default Sidebar
