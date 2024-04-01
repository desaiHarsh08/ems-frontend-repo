import { createSlice } from "@reduxjs/toolkit";

// Parse user-credentials from localStorage or provide a default value
const DEFAULT_VALUE = {
    "user-credentials": localStorage.getItem('user-credentials') !== undefined ? JSON.parse(localStorage.getItem('user-credentials')) : { acessToken: '', refreshToken: '', user: {}}};

const authSlice = createSlice({
    name: "auth",
    initialState: DEFAULT_VALUE,
    reducers: {
        setUserCredentials: (state, action) => {
            console.log(action)
            state["user-credentials"] = action.payload.userCredentials;
            console.log(action.payload.userCredentials);
            console.log(state);
            localStorage.setItem('user-credentials', JSON.stringify(state["user-credentials"]));
            if(action.payload.userCredentials.examIds) {
                localStorage.setItem('examids', JSON.stringify(action.payload.userCredentials.examIds));
            }
            return state;
        },
        logoutUser: (state) => {
            localStorage.clear();
            state = DEFAULT_VALUE;
            return state;
        }
    }
});

export const { setUserCredentials, logoutUser } = authSlice.actions;

export default authSlice.reducer;