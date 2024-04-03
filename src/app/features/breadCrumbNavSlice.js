import { createSlice } from "@reduxjs/toolkit";


const DEFAULT_VALUE = {
    floors: false,
    rooms: false,
}

const breadCrumbNavSlice = createSlice({
    name: "breadCrumbNav",
    initialState: DEFAULT_VALUE,
    reducers: {
        toogleBreadCrumbNavItem: (state, action) => {
            console.log("redux state called for", action);
            if(action.payload.navItem.toLowerCase() === 'floors') {
                state.floors = !state.floors;
                if(state.rooms) {
                    state.rooms = false;
                }
            }   
            else if(action.payload.navItem.toLowerCase() === 'rooms') {
                state.rooms = !state.rooms;
            }
            else if(action.payload.navItem.toLowerCase() === 'reset') {
                state.floors = false;
                state.rooms = false;
            }
            return state;
        },

    }
});

export const { toogleBreadCrumbNavItem } = breadCrumbNavSlice.actions;

export default breadCrumbNavSlice.reducer;