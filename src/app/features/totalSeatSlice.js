import { createSlice } from "@reduxjs/toolkit";

const totalSeatSlice = createSlice({
    name: 'totalSeats',
    initialState: { totalSeats: JSON.parse(localStorage.getItem('total-seats')) },
    reducers: {
        setTotalSeats: (state, action) => {
            localStorage.setItem('total-seats', JSON.stringify(action.payload.totalSeats));
            state.totalSeats = action.payload.totalSeats;
            return state;
        }
    }
});

export const { setTotalSeats } =  totalSeatSlice.actions;

export default totalSeatSlice.reducer;