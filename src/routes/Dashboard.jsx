import React, { useEffect } from 'react'
import Navbar from '../components/common_components/Navbar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/route_components/dashboard/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../app/features/authSlice';
import Loading from '../components/common_components/Loading';
import '../App.css';
import { toogleNavbar, toogleSidebar } from '../app/features/sidebarToggleSlice';

const Dashboard = () => {

  const navigate = useNavigate()

  const dispatch = useDispatch();

  const loading = useSelector((state) => state.loadingStatus);
  const userCredentials = useSelector((state) => state.auth);
  const sidebarToogle = (useSelector((state) => state.sidebarToogle));

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/', { replace: true });
  }

  useEffect(() => {
    if (userCredentials == undefined) {
      handleLogout();
    }
  }, [])

  // useEffect(() => {
  //   if (window.innerWidth < 991) {
  //     document.getElementById('sidebar').classList.toggle('translate-sidebar')
  //   }

  //   dispatch(toogleSidebar())
  //   // dispatch(toogleNavbar())
  //   // console.log(sidebarToogle)
  // }, [window.innerWidth]);

  return (
    <>
      {/* Loading COMPONENT */}
      <div id="loading-container" className="loading-container w-full">
        {loading ===true && <Loading />}
      </div>

      {/* DASHBOARD */}
      <div id='dashboard' className='dashboard h-screen overflow-y-hidden text-xs '>

        {/* NAVBAR COMPONENT */}
        <div id='navbar' className='navbar h-[58px] flex w-full app-container'>
          <Navbar />
        </div>
        <div className='flex text-slate-600 '>
          {/* SIDEBAR COMPONENT */}
          <div id="sidebar" className={`sidebar ${sidebarToogle.sideBarFlag==true ? 'translate-sidebar': ''}  transition-all ease-in-out lg:translate-x-0`}>
            <Sidebar />
          </div>
          {/* SHARED AREA */}
          <div className='shared-area  h-[95vh] py-7  overflow-auto'  >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
