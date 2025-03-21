import { createSlice } from "@reduxjs/toolkit";

const hostSlice = createSlice({
    name: "host",
    initialState: { host: import.meta.env.VITE_APP_BACKEND_URL },
    reducers: {}
});

export default hostSlice.reducer;