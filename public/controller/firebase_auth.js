import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
    createUserWithEmailAndPassword, } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import * as Elements from '../viewpage/elements.js';
import {DEV} from '../model/constants.js';
import * as Util from '../viewpage/util.js';
import { routing, ROUTE_PATHNAMES } from './route.js';
import { initShoppingCart } from '../viewpage/cart_page.js';
const auth = getAuth();

export let currentUser = null;

export function addEventListeners() {

    onAuthStateChanged(auth, AuthStateChanged);

    Elements.formSignIn.addEventListener('submit', async e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const button = e.target.getElementsByTagName('button')[0];
        const label = Util.disableButton(button);
        

        try{
            await signInWithEmailAndPassword(auth,email,password);
            Elements.modalSignin.hide();
            console.log('Sign-in Success');
        }catch(e){
            if(DEV) console.log(e);
            Util.info('Sign in Error',JSON.stringify(e),Elements.modalSignin);

        }
        Util.enableButton(button,label);
    });

    Elements.MENU.SignOut.addEventListener('click', async () => {
        try {
            await signOut(auth);
            console.log('Sign out success');
        } catch (e) {
            if (DEV) console.log(e);
            Util.info('sign out error', JSON.stringify(e));
        }
    });

    
}

async function AuthStateChanged(user) {
    currentUser = user;
    if (user) {
        let elements = document.getElementsByClassName('modal-preauth');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
        elements = document.getElementsByClassName('modal-postauth'); {
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.display = 'block';
            }
        }
        const pathname = window.location.pathname;
        const hash = window.location.hash;
        initShoppingCart();
        routing(pathname, hash);
        
    }
    else {
        currentUser = null;
        let elements = document.getElementsByClassName('modal-preauth');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'block';
        }
        elements = document.getElementsByClassName('modal-postauth'); {
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.display = 'none';
            }
        }
        const pathname = window.location.pathname;
        const hash = window.location.hash;
        history.pushState(null,null,ROUTE_PATHNAMES.HOME);
        routing(pathname, hash);
    }
}
        