import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setFloorNumber } from '../../../app/features/floorNumberSlice';

const FloorsDisplay = () => {

    const location = useLocation();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const host = useSelector((state) => state.host.host);
    const exam = (useSelector((state) => state.exam)).examSelected;
    const auth = useSelector((state) => state.auth);
    const loading = useSelector((state) => state.loadingStatus);

    const [floorsDone, setFloorsDone] = useState([]);

    const examIds = JSON.parse(localStorage.getItem('examids'));

    const [floorNumberForNonAdmin, setFloorNumberForNonAdmin] = useState();

    useEffect(() => {
        // document.getElementById('bread-crumb').classList.remove('invisible')
        fetchFloorStatus();
    }, []);

    useEffect(() => {
        if (exam) {
            // console.log("exam:", exam, auth)
            for (let i = 0; i < exam.examLocations.length; i++) {
                let floor = exam.examLocations[i];
                // // console.log("in loop floor:", floor)
                for (let j = 0; j < floor.rooms.length; j++) {
                    for (let k = 0; k < floor.rooms.length; k++) {
                        // // console.log(floor.rooms[k])
                        if (floor.rooms[k].roomNumber == auth['user-credentials'].user.roomNumber) {
                            // console.log(exam.examLocations[i]);
                            setFloorNumberForNonAdmin(exam.examLocations[i]);
                            break;
                        }
                    }
                }
            }
        }
        // console.log(floorNumberForNonAdmin)
    }, [exam, floorNumberForNonAdmin]);

    const isFloorAttendanceMarked = async (floorNumber) => {
        try {
            const response = await axios.post(
                `${host}/api/exam_read_only/get-exam-obj-floor`,
                {
                    examName: exam.examName,
                    examDate: exam.examDate,
                    floorNumber: floorNumber
                },
                {
                    headers: {
                        accessToken: auth["user-credentials"].accessToken,
                        refreshToken: auth["user-credentials"].refreshToken,
                        email: auth["user-credentials"].user.email
                    }
                }
            );
            // // console.log(response);
            return response.data.payload;
        } catch (error) {
            // console.log(error);
        }
    }

    const fetchFloorStatus = async () => {
        const promises = exam.examLocations.map(async (location) => {
            const data = await isFloorAttendanceMarked(location.floorNumber);
            // // console.log(location, data);
            return data && data.length === location.rooms.length ? location.floorNumber : null;
        });

        const floorsDone = await Promise.all(promises);
        // // console.log("floorsDone after promise all:", floorsDone)
        setFloorsDone(floorsDone.filter((floor) => floor !== null));
    };

    const getSortedFloors = (floors) => {
        return floors.slice().sort((a, b) => {
            const floorNumberA = parseInt(a.floorNumber, 10);
            const floorNumberB = parseInt(b.floorNumber, 10);
            return floorNumberA - floorNumberB;
        });
    };

    const handleFloorClick = (floorNumber) => {
        // // console.log(floorNumber);
        dispatch(setFloorNumber({ floorNumber }));
        // // console.log("ok");
        navigate(`floor-${floorNumber}`, { replace: true });
    }

    return (
        <div className='flex flex-col gap-3 justify-center items-center py-7 '>
            {
                exam && exam.examLocations && getSortedFloors(exam.examLocations)?.map((floor, index) => {
                    if ((auth['user-credentials'].user.userType === 'ADMIN') || (auth['user-credentials'].user.userType === 'EXAM_OC')) {
                        return <div onClick={() => { handleFloorClick(floor.floorNumber) }} to={`${floor.floorNumber}`} key={`floor-${index}`} className={`flex items-center gap-5 cursor-pointer border border-slate-400 p-3 rounded-md hover:shadow-lg ${floorsDone.includes(floor.floorNumber) ? 'bg-green-400 font-medium' : ''} `}>
                            <img src='/floor-icon-0.jpg' alt='floor-img' className='w-20' />
                            <p className='text-xl'>Floor {floor.floorNumber}</p>
                        </div>
                    }
                    // else if(examIds.includes(exam._id)) {
                    //     return <div onClick={() => { handleFloorClick(floor.floorNumber) }} to={`${floor.floorNumber}`} key={`floor-${index}`} className={`flex items-center gap-5 cursor-pointer border border-slate-400 p-3 rounded-md hover:shadow-lg ${floorsDone.includes(floor.floorNumber) ? 'bg-green-400 font-medium' : ''} `}>
                    //         <img src='/floor-icon-0.jpg' alt='floor-img' className='w-20' />
                    //         <p className='text-xl'>Floor {floor.floorNumber}</p>
                    //     </div>
                    // }
                })
            }

{console.log('here')}
            {
            // // console.log(floorNumberForNonAdmin)
                exam && exam.examLocations && floorNumberForNonAdmin &&
                <div onClick={() => { handleFloorClick(floorNumberForNonAdmin?.floorNumber) }} to={`${floorNumberForNonAdmin?.floorNumber}`} className={`flex items-center gap-5 cursor-pointer border border-slate-400 p-3 rounded-md hover:shadow-lg ${floorsDone.includes(floorNumberForNonAdmin?.floorNumber) ? 'bg-green-400 font-medium' : ''} `}>
                     <img src='/floor-icon-0.jpg' alt='floor-img' className='w-20' />
                     <p className='text-xl'>Floor {floorNumberForNonAdmin?.floorNumber}</p>
                 </div>
            }
        </div>
    )
}

export default FloorsDisplay