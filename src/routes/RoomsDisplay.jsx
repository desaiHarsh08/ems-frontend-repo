import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setRoomNumber } from '../app/features/roomNumberSlice';
import { setTotalSeats } from '../app/features/totalSeatSlice';
import axios from 'axios';

const RoomsDisplay = () => {

    const location = useLocation();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const host = useSelector((state) => state.host.host);
    const exam = (useSelector((state) => state.exam)).examSelected;
    const auth = useSelector((state) => state.auth);
    const loading = useSelector((state) => state.loadingStatus);
    const floorNumber = (useSelector((state) => state.floorNumber)).floorNumber;
    console.log(floorNumber)
if(!floorNumber) {
    return 'no floor selected';
}

    console.log(exam.examLocations.find((ele) => ele.floorNumber == floorNumber));
    const { rooms } = exam.examLocations.find((ele) => ele.floorNumber == floorNumber);

    const [roomsDone, setRoomsDone] = useState([]);
    const [userRoom, setUserRoom] = useState(null);

    useEffect(() => {
        // console.log(document.getElementById('bread-crumb'))
        // document.getElementById('bread-crumb').classList.remove('invisible')
        fetchRoomData();
        if(auth['user-credentials'].user.userType === 'INVIGILATOR') {
            const tmp = rooms.find(ele => ele.roomNumber == auth['user-credentials'].user.roomNumber.toString());
            // console.log(tmp)
            setUserRoom(tmp);
        }
    }, [userRoom]);

   

    const getSortedRooms = (rooms) => {
        const sortedRooms = rooms.slice().sort((a, b) => {
            // // console.log(a, b)
            const roomNumberA = String(a?.roomNumber || '').toUpperCase();
            const roomNumberB = String(b?.roomNumber || '').toUpperCase();

            const isNumericA = /^\d+$/.test(roomNumberA);
            const isNumericB = /^\d+$/.test(roomNumberB);

            if (isNumericA && isNumericB) {
                return parseInt(roomNumberA, 10) - parseInt(roomNumberB, 10);
            } else if (isNumericA) {
                return -1;
            } else if (isNumericB) {
                return 1;
            } else {
                return roomNumberA.localeCompare(roomNumberB, undefined, { numeric: true });
            }
        });
        rooms = sortedRooms;
        return sortedRooms;
    };

    const fetchRoomData = async () => {
        const promises = rooms.map((room) => isRoomAttendanceMarked(room.roomNumber));
        const results = await Promise.all(promises);

        const nonNullResults = results.filter((result) => result !== null);
        const tmpRoomsDone = [];
        // console.log(nonNullResults);
        for (let index = 0; index < nonNullResults.length; index++) {
            const tmp = nonNullResults[index].uniqueId;
            tmpRoomsDone.push(tmp.substring(tmp.lastIndexOf('/')+1));
        }
        // console.log(tmpRoomsDone);
        setRoomsDone(tmpRoomsDone);
    };

    const isRoomAttendanceMarked = async (roomNumber) => {
        try {
            const response = await axios.post(
                `${host}/api/exam_read_only/get-exam-obj`,
                {
                    examName: exam.examName,
                    examDate: exam.examDate,
                    floorNumber: floorNumber,
                    roomNumber: roomNumber
                },
                {
                    headers: {
                        accessToken: auth["user-credentials"].accessToken,
                        refreshToken: auth["user-credentials"].refreshToken,
                        email: auth["user-credentials"].user.email
                    }
                }
            );
            // console.log(response);
            return response.data.payload;
        } catch (error) {
            // console.log(error);
            return null;
        }
    }

    const handleRoomClick = ({ roomNumber, seatsArr }) => {
        // console.log(roomNumber, seatsArr.length);
        dispatch(setRoomNumber({roomNumber: roomNumber}));
        dispatch(setTotalSeats({totalSeats: seatsArr.length}));
        // console.log(`/dashboard/${exam._id}/floor-${floorNumber}/room-${roomNumber}`)
        navigate(`/dashboard/${exam._id}/floor-${floorNumber}/room-${roomNumber}`, { replace: true });
    
      }

    return (
        <div className='my-3 '>

            <div className='flex justify-center gap-3 floor-room-container flex-wrap overflow-auto'>
                {(auth['user-credentials'].user.userType === 'ADMIN' || auth['user-credentials'].user.userType === 'EXAM_OC') &&
                    getSortedRooms(rooms).map((room, index) => (
                        
                        <div key={`room-${index}`} onClick={() => { handleRoomClick(room) }} className={`flex items-center gap-5 cursor-pointer border border-slate-400 p-3 rounded-md hover:shadow-lg ${roomsDone.includes(room.roomNumber) ? 'bg-green-400 font-medium' : ''}`}>
                            <img src='/room.webp' alt='Room' className='w-20' />
                            <p className='text-xl'>{room.roomNumber}</p>
                        </div>
                    ))
                }
                
                
                {(userRoom && auth['user-credentials'].user.userType === 'INVIGILATOR') &&
                    <div onClick={() => { handleRoomClick(userRoom) }} className={`flex items-center gap-5 cursor-pointer border border-slate-400 p-3 rounded-md hover:shadow-lg ${roomsDone.includes(userRoom.roomNumber) ? 'bg-green-400 font-medium' : ''}`}>
                        <img src='/room.webp' alt='Room' className='w-20' />
                        <p className='text-xl'>{userRoom.roomNumber}</p>
                    </div>
                }
            
                

            </div>
        </div>
    )
}

export default RoomsDisplay