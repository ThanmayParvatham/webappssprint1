import { MENU, modalCreateComment, root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import * as Util from './util.js';
import { UserComment } from '../model/userComment.js';
import { currentUser } from '../controller/firebase_auth.js';
import { getPurchaseHistory, returnPurchasedItem, uploadComment } from '../controller/firestore_controller.js';
import { DEV } from '../model/constants.js';
import { modalTransaction } from './elements.js';
export function addEventListeners() {
    MENU.Purchases.addEventListener('click', async () => {
        history.pushState(null, null, ROUTE_PATHNAMES.PURCHASES);
        const label = Util.disableButton(MENU.Purchases);
        await purchases_page();
        Util.enableButton(MENU.Purchases, label);
    });
}


export async function purchases_page() {
    if (!currentUser) {
        root.innerHTML = '<h1> Protected Page</h1>';
        return;
    }

    let html = '<h1>Purchase History</h1>'

    let carts;
    try {
        carts = await getPurchaseHistory(currentUser.uid);
        // console.log("*&*" + JSON.stringify(carts));
        if (carts.length == 0) {
            html += '<h3>No Purchase History Found!</h3>';
            root.innerHTML = html;
            return;
        }

    } catch (e) {
        if (DEV) console.log(e);
        Util.info('Error in getPurchaseHistory', JSON.stringify(e));
        root.innerHTML = '<h1>Failed to get purchase history</h1>';
        return;
    }

    html += `
    <table class="table">
    <thead>
      <tr>
        <th scope="col">View</th>
        <th scope="col">Items</th>
        <th scope="col">Price</th>
        <th scope="col">Date</th>
      </tr>
    </thead>
    <tbody>
    `;

    for (let i = 0; i < carts.length; i++) {
        html += `
        <tr>
            <td>
                <form method="post" class="form-purchase-details">
                    <input type="hidden" name="index" value="${i}">
                    <button type="submit" class="btn btn-outline-primary">Details</button>
                </form
            </td>
            <td>${carts[i].getTotalQty()}</td>
            <td>${Util.currency(carts[i].getTotalPrice())}</td>
            <td>${new Date(carts[i].timestamp).toString()}</td>
        </tr>
        `;
    }

    html += '</tbody></table>';
    root.innerHTML = html;

    const detailsFrom = document.getElementsByClassName('form-purchase-details');
    for (let i = 0; i < detailsFrom.length; i++) {
        detailsFrom[i].addEventListener('submit', e => {
            e.preventDefault();
            const index = e.target.index.value;
            modalTransaction.title.innerHTML = `Purchased At: ${new Date(carts[index].timestamp).toString()}`;
            modalTransaction.body.innerHTML = buildTransactionView(carts[index], index);
            modalTransaction.modal.show();
            const returnForms = document.getElementsByClassName('form-return-item');
            for (let i = 0; i < returnForms.length; i++) {
                returnForms[i].addEventListener('submit', async e => {
                    e.preventDefault();
                    const returnProductName = e.target.returnProductName.value;
                    const currentIndex = e.target.currentIndex.value;
                    const productDetail = carts[currentIndex];
                    const productDetail1 = carts[currentIndex];
                    //console.log(JSON.stringify(carts));
                    const newCartItems = productDetail.items.filter(e => e.name != returnProductName);
                    productDetail.items = newCartItems;
                    //console.log("^" + returnProductName +" "+ currentIndex + " " +JSON.stringify(productDetail) + " ");
                    if (confirm("Are you sure !")) {
                        try {
                            modalTransaction.modal.hide();
                            await returnPurchasedItem(productDetail);
                            //modalTransaction.modal.show();
                            //modalTransaction.modal.hide();
                            //purchases_page();
                            // await Util.sleep(1000);
                            Util.info('Success', 'Successfully requested for return.');

                        } catch (e) {
                            if (DEV) console.log(e);
                        }
                    }
                })
            }
            const commentForms = document.getElementsByClassName('form-comment-item');
            for (let i = 0; i < commentForms.length; i++) {
                commentForms[i].addEventListener('submit', async e => {
                    e.preventDefault();
                    const commentProductName = e.target.commentProductName.value;
                    modalCreateComment.show();
                    const formCreateComment = document.getElementById('form-create-comment');
                    formCreateComment.addEventListener('submit', async f => {
                        e.preventDefault();
                        //await Util.sleep(5000);

                        const commentContent = f.target.commentContent.value;
                            try {
                                 const commentEmail = currentUser.email;
                                const Ctoc = Date.now();
                                const data = new UserComment();
                                data.productName = commentProductName;
                                data.email = commentEmail;
                                data.comment = commentContent;
                                data.toc = Ctoc;
                                // const finalData = new UserComment({
                                //     commentProductName,
                                //     commentEmail,
                                //     commentContent,
                                //     Ctoc
                                // });
                                await uploadComment(data);
                                //console.log("^" + JSON.stringify(data) );
                                //await Util.sleep(50000000000000);
                                //await Util.sleep(50000000000000);
                                //alert('Commented Successfully !')
                            } catch (e) {
                                if (DEV) console.log(e);
                            }
                        
                    });
                })
            }
        })
    }
}
function buildTransactionView(cart, index) {
    let html = `
    <table class="table">
    <thead>
      <tr>
        <th scope="col">Image</th>
        <th scope="col">Name</th>
        <th scope="col">Price</th>
        <th scope="col">Qty</th>
        <th scope="col">Sub-Total</th>
        <th scope="col" width="100%">Summary</th>
      </tr>
    </thead>
    <tbody>
    `;
    cart.items.forEach(p => {
        html += `
            <tr id = "eachItemID">
                <td><img src="${p.imageURL}" width= "80px"></td>
                <td>${p.name}</td>
                <td>${Util.currency(p.price)}</td>
                <td>${p.qty}</td>
                <td>${Util.currency(p.price * p.qty)}</td>
                <td>${p.summary}</td>
                <td>
                <form method="post" class="form-return-item">
                    <input type="hidden" name="currentIndex" value="${index}">
                    <input type="hidden" name="returnProductName" value="${p.name}">
                    <button type="submit" class="btn btn-outline-primary">Return</button>
                 </form>
                </td>
                <td>
                <form method="post" class="form-comment-item">
                    <input type="hidden" name="commentProductName" value="${p.name}">
                    <button type="submit" class="btn btn-outline-primary">Comment</button>
                 </form>
                </td>
            </tr>
        `;
    });
    html += "</tbody></table>"
    html += `
        <div class="fs-3">Total: ${Util.currency(cart.getTotalPrice())}</div>
    `;
    return html;
}