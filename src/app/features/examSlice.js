import { createSlice } from "@reduxjs/toolkit";

const examSlice = createSlice({
    name: 'exam',
    initialState: { examSelected: JSON.parse(localStorage.getItem('exam')) || { examName: '', examDate: '', examTime: '', examLocations: [] } },
    reducers: {
        setExam: (state, action) => {
            console.log("in setExam: ", action.payload.exam);
            state.examSelected = action.payload.exam;
            for (let i = 0; i < state.examSelected.examLocations.length; i++) {
                let floor = state.examSelected.examLocations[i];
                for (let j = 0; j < floor.rooms.length; j++) {
                    floor.rooms[j].answerScript.expected = floor.rooms[j].seatsArr[0];
                    floor.rooms[j].answerScript.actual = floor.rooms[j].actual || floor.rooms[j].seatsArr[0];
                }
                state.examSelected.examLocations[i] = floor;
            }

            localStorage.setItem('exam', JSON.stringify(action.payload.exam));
            return state;
        },
        updateExam: (state, action) => {
            const { indexFloor, floorNumber, room } = action.payload;
            const newExam = {...state.examSelected}; // Shallow copy of the exam state
            const tmpRooms = newExam.examLocations.find(ele => ele.floorNumber == floorNumber).rooms;
            const newRooms = tmpRooms.filter(ele => ele.roomNumber !== room.roomNumber);
            newRooms.push(room);
            for (let i = 0; i < newExam.examLocations.length; i++) {
                if (newExam.examLocations[i].floorNumber == floorNumber) {
                    newExam.examLocations[i].rooms = newRooms;
                }
            }
            console.log(newExam)
            state.examSelected = newExam;

            localStorage.setItem('exam', JSON.stringify(newExam));

            return state;
        },
        setExamActual: (state, action) => {
            console.log("in setExam: ", action.payload.exam);
            state.examSelected = action.payload.exam;
            

            localStorage.setItem('exam', JSON.stringify(action.payload.exam));
            return state;
        }
    }
});

export const { setExam, updateExam, setExamActual } = examSlice.actions;

export default examSlice.reducer;