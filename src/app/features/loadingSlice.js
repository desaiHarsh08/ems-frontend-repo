import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
    name: "loading",
    initialState: { loadingStatus: false },
    reducers: {
        toggleLoadingStatus: (state) => {
            state.loadingStatus = !state.loadingStatus;
            console.log("after setting, state.loadingStatus:", state.loadingStatus);
            return state;
        },
    }
});

export const { toggleLoadingStatus } = loadingSlice.actions;

export default loadingSlice.reducer;