import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom'
import Root from './routes/Root.jsx'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import Dashboard from './routes/Dashboard.jsx'
import DashboardHome from './components/route_components/dashboard/DashboardHome.jsx'
import CreateExam from './routes/CreateExam.jsx'
import ExamReport from './routes/ExamReport.jsx'
import Exam from './routes/Exam.jsx'
import FloorsDisplay from './components/route_components/exam/FloorsDisplay.jsx'
import RoomsDisplay from './routes/RoomsDisplay.jsx'
import SeatsDisplay from './routes/SeatsDisplay.jsx'
import Workspace from './routes/Workspace.jsx'
import UpcomingExams from './routes/UpcomingExams.jsx'
import PreviousExams from './routes/PreviousExam.jsx'

const router = createHashRouter([
  { path: '/', element: <App />, children: [{ path: '', element: <Root /> }] },
  { 
    path: '/dashboard', 
    element: <Dashboard />, 
    children: [
      {
        path: '',
        element: <DashboardHome />,
        children: [
          
        ]
      },
      {
        path: 'upcoming-exams',
        element: <UpcomingExams />
      },
      {
        path: 'previous-exams',
        element: <PreviousExams />
      },
      {
        path: 'create-exam',
        element: <CreateExam />
      },
      {
        path: 'exam-report',
        element: <ExamReport />
      },
      {
        path: ':examId',
        element: <Exam />,
        children: [
          {
            path: '',
            element: <FloorsDisplay />,
          },
          {
            path: ':floor-floorNumber',
            element: <RoomsDisplay />,
          },
          {
            path: '/dashboard/:examId/:floor-floorNumber/:room-roomNumber',
            element: <SeatsDisplay />,
          },
          
        ]
      },
      {
        path: 'workspace',
        element: <Workspace />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
