import {
    getFirestore,
    query, collection,
    orderBy,
    getDocs, getDoc,
    setDoc, addDoc,
    where, doc, updateDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { AccountInfo } from "../model/account_info.js";
import { purchases_page } from "../viewpage/purchases_page.js";
import { COLLECTION_NAMES } from "../model/constants.js";
import { Product } from "../model/product.js";
import { ShoppingCart } from "../model/shopping_cart.js";
const db = getFirestore();

export async function getProductList() {
    const products = [];
    const q = query(collection(db, COLLECTION_NAMES.PRODUCT), orderBy('name'));
    const snapShot = await getDocs(q);

    snapShot.forEach(doc => {
        const p = new Product(doc.data());
        p.set_docId(doc.id);
        products.push(p);
    });
    return products;
}

export async function checkout(cart) {
    const data = cart.serialize(Date.now());
    await addDoc(collection(db, COLLECTION_NAMES.PURCHASE_HISTORY), data);
}

export async function getPurchaseHistory(uid) {
    const q = query(collection(db, COLLECTION_NAMES.PURCHASE_HISTORY),
        where('uid', '==', uid),
        orderBy('timestamp', 'desc'));
    const snapShot = await getDocs(q);
    //console.log("** " + JSON.stringify(q));
    const carts = [];
    snapShot.forEach(doc => {
        const sc = ShoppingCart.deserialize(doc.data());
        sc.setDocId(doc.id)
        carts.push(sc);
    });
    return carts;
}

export async function getAccountInfo(uid) {
    const docRef = doc(db, COLLECTION_NAMES.ACCOUNT_INFO, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return new AccountInfo(docSnap.data());
    }
    else {
        const defaultInfo = AccountInfo.instance();
        const accountDocRef = doc(db, COLLECTION_NAMES.ACCOUNT_INFO, uid);
        await setDoc(accountDocRef, defaultInfo.serialize());
        return defaultInfo;
    }
}

export async function updateAccountInfo(uid, updateInfo) {
    const docRef = doc(db, COLLECTION_NAMES.ACCOUNT_INFO, uid);
    await updateDoc(docRef, updateInfo);
}

// export async function returnPurchasedItem(docID, cart) {
//     const docRef = doc(db, COLLECTION_NAMES.PURCHASE_HISTORY, uid);
//     const data = cart.serialize(Date.now());
//     await updateDoc(docRef, data);
// }
export async function returnPurchasedItem(productDetail) {
    const docRef = doc(db, COLLECTION_NAMES.PURCHASE_HISTORY, productDetail.docId);
    const data = productDetail.serialize(Date.now());
    if (data.items.length == 0) {
        await deleteDoc(docRef)
    }
    else {
        await updateDoc(docRef, data);
    }
    purchases_page();
    //console.log(data.items.length);
}

export async function uploadComment(comment) {
    const data = comment.serialize();
    const docRef = await addDoc(collection(db, Constants.COLLECTIONS.USER_COMMENTS), data);
}