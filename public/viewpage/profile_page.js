import { MENU,root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
export function addEventListeners(){
    MENU.Profile.addEventListener('click',async() => {
        history.pushState(null,null,ROUTE_PATHNAMES.PROFILE);
        await profile_page();

    });
}
export async function profile_page(){
    root.innerHTML = '<h1>Profile Page</h1>'
}