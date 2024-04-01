import { createSlice } from "@reduxjs/toolkit";

const floorNumberSlice = createSlice({
    name: 'floorNumber',
    initialState: { floorNumber: JSON.parse(localStorage.getItem('floor-number')) },
    reducers: {
        setFloorNumber: (state, action) => {
            localStorage.setItem('floor-number', JSON.stringify(action.payload.floorNumber));
            state.floorNumber = action.payload.floorNumber;
            return state;
        }
    }
});

export const { setFloorNumber } = floorNumberSlice.actions;

export default floorNumberSlice.reducer;