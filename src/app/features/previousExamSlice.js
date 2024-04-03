import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_VALUE = {
    previousExamFlag: localStorage.getItem('previousExamFlag') !== undefined ?
        JSON.parse(localStorage.getItem('previousExamFlag')) : false
}

const previousExamFlagSlice = createSlice({
    name: "previousExamFlag",
    initialState: DEFAULT_VALUE,
    reducers: {
        tooglePreviousExam: (state) => {
            const flag = !state.previousExamFlag
            state.previousExamFlag = flag;
            console.log("redux previousExamFlag:", flag);
            localStorage.setItem('previousExamFlag', JSON.parse(flag));
            return state;
        },

    }
});

export const { tooglePreviousExam } = previousExamFlagSlice.actions;

export default previousExamFlagSlice.reducer;