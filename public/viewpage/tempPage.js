const commentForms = document.getElementsByClassName('form-comment-item');
for (let i = 0; i < commentForms.length; i++) {
    commentForms[i].addEventListener('submit', async e => {
        e.preventDefault();
        const commentProductName = e.target.commentProductName.value;
        modalCreateComment.show();
        const commentContent = e.target.value;
        console.log("^" + commentProductName + " " + commentContent);
    })
}
form.addEventListener('submit', async e => {
    e.preventDefault()
    const commentContent = e.target.commentContent.value;
});