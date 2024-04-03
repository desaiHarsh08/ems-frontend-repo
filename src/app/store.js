import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./features/loadingSlice";
import hostReducer from "./features/hostSlice";
import authReducer from "./features/authSlice";
import floorNumberReducer from "./features/floorNumberSlice";
import roomNumberReducer from "./features/roomNumberSlice";
import examReducer from "./features/examSlice";
import totalSeatsReducer from "./features/totalSeatSlice";
import sidebarToogleReducer from "./features/sidebarToggleSlice";
import breadCrumbNavReducer from "./features/breadCrumbNavSlice";
import previousExamFlagReducer from "./features/previousExamSlice";

export const store = configureStore({
    reducer: {
        loading: loadingReducer,
        host: hostReducer,
        auth: authReducer,
        floorNumber: floorNumberReducer,
        roomNumber: roomNumberReducer,
        exam: examReducer,
        totalSeats: totalSeatsReducer,
        sidebarToogle: sidebarToogleReducer,
        breadCrumbNav: breadCrumbNavReducer,
        previousExamFlag: previousExamFlagReducer
    }
})