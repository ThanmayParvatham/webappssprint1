const q = query(collection(db, COLLECTION_NAMES.USER_COMMENTS),
        where('productName', '==', productName),
        orderBy('toc', 'desc'));
    const snapShot = await getDocs(q);
    //console.log("** " + JSON.stringify(q));
    const comments = [];
    snapShot.forEach(doc => {
        const c = UserComment(doc.data());
        comments.push(c);
    });
    return comments;