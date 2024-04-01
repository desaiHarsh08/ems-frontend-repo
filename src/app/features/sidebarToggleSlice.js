import { createSlice } from "@reduxjs/toolkit";

const sidebarTranslateSlice = createSlice({
    name: 'sidebarToogle',
    initialState: { sideBarFlag: false },
    reducers: {
        toogleSidebar: (state) => {
            if (window.innerWidth < 991) {
                state.sideBarFlag = !state.sideBarFlag;
                console.log(state.sideBarFlag)
                return state;
            }
        },
        toogleNavbar: (state) => {
            const bar1 = document.getElementById('bar1');
            const bar2 = document.getElementById('bar2');
            const bar3 = document.getElementById('bar3');

            bar1.classList.toggle('translate-y-2');
            bar1.classList.toggle('rotate-45');
            bar1.classList.toggle('bg-black');
            bar1.classList.toggle('bg-red-500');

            bar2.classList.toggle('invisible')

            bar3.classList.toggle('-translate-y-2');
            bar3.classList.toggle('-rotate-45');
            bar3.classList.toggle('bg-black');
            bar3.classList.toggle('bg-red-500');
            
        }
    }
});

export const { toogleSidebar, toogleNavbar } = sidebarTranslateSlice.actions;

export default sidebarTranslateSlice.reducer;