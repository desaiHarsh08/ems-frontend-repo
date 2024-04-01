import React from 'react'
import Footer from './components/common_components/Footer'
import { Outlet } from 'react-router-dom'
import Loading from './components/common_components/Loading'
import { useSelector } from 'react-redux'
import './App.css'
import Navbar from './components/common_components/Navbar'

const App = () => {

  const loading = useSelector((state)=> state.loadingStatus);

  return (
    <div className='App h-screen  '>
      {/* Loading COMPONENT */}
      <div id="loading-container" className="loading-container w-full">
      {loading && <Loading />}
      </div>
      <Outlet />
      
      <Footer />
    </div>
  )
}

export default App



















// import './App.css';
// import Dashboard from './components/Dashboard';
// import DisplayFloors from './components/DisplayFloors';
// import FromFloorsToRoomDisplay from './components/FromFloorsToRoomDisplay';
// import Home from './components/Home';
// import LoginPage from './components/LoginPage';
// import RecentExamAttendance from "./components/RecentExamAttendance"
// import {
//   HashRouter as Router,
//   Routes,
//   Route,
//   // useLocation
// } from "react-router-dom";
// import CreateExam from './components/CreateExam';
// import ViewAttendance from './components/ViewAttendance';
// import SeatsDisplay from './components/SeatsDisplay';
// import { useState } from 'react';
// import Loading from './components/Loading';
// // eslint-disable-next-line
// // import { useEffect } from 'react';
// // import Loading from './components/Loading';

// function App() {

//   // const location = useLocation();

//   // const host =  process.env.REACT_APP_BACKEND_URL;
//   const host =  "http://13.235.168.107:5003";
//   // const host =  "http://localhost:5000";

//   const [loading, setLoading] = useState(false);

// // console.log(process.env.REACT_APP_BACKEND_URL)÷





//   // return (
//   //   <Router>
//   //     <div className="App overflow-hidden h-screen">
//   //       {loading===true? <Loading />: ''}
 

//   //       <Routes>
//   //         <Route exact path={'/'} element={<LoginPage host={host} />} />
//   //         <Route exact path={'/dashboard'} element={<Dashboard />}>
//   //           <Route path={''} element={<Home host={host} setLoading={setLoading} />} />
//   //           <Route path={'recent-exam'} element={<RecentExamAttendance  />}>
//   //             <Route path={''} element={<DisplayFloors host={host} setLoading={setLoading} />} />
//   //             <Route path={'floor'}  >
//   //               <Route path='' element={<FromFloorsToRoomDisplay host={host} setLoading={setLoading} />} />
//   //               <Route  path={'room'} element={<SeatsDisplay setLoading={setLoading} host={host} />} />
//   //             </Route>

//   //           </Route>
//   //           <Route exact path={'create-exam'} element={<CreateExam setLoading={setLoading} host={host}  />} />
//   //           <Route exact path={'view-attendance'} element={<ViewAttendance host={host}  />} />
//   //         </Route>



//   //       </Routes>

//   //     </div>
//   //   </Router>
//   // );
// }

// export default App;
