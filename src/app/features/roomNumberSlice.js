import { createSlice } from "@reduxjs/toolkit";

const roomNumberSlice = createSlice({
    name: 'roomNumber',
    initialState: { roomNumber: JSON.parse(localStorage.getItem('room-number')) },
    reducers: {
        setRoomNumber: (state, action) => {
            localStorage.setItem('room-number', action.payload.roomNumber);
            state.roomNumber = action.payload.roomNumber;
            return state;
        }
    }
});

export const { setRoomNumber } =  roomNumberSlice.actions;

export default roomNumberSlice.reducer;