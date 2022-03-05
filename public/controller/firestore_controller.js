import {
    getFirestore,
    query,
    collection,
    orderBy,
    getDocs,
} from  "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";
import { COLLECTION_NAMES } from "../model/constants.js";
import { Product } from "../model/product.js";
const db = getFirestore();

export async function getProductList(){
    const products = [];
    const q = query(collection(db,COLLECTION_NAMES.PRODUCT),orderBy('name'));
    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const p = new Product(doc.data());
        p.set_docId(doc.id);
        products.push(p);
    });
    return products;
}