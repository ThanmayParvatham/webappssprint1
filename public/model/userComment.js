export class UserComment {
    constructor(data) {
        if (data) {
            this.productName = data.productName;
            this.email = data.email;
            this.comment = data.comment;
            this.toc = data.toc; // time of comment
        }
    }
    setDocId(id) {
        this.docId = id;
    }
    // clone
    clone() {
        const copyData = this.serialize();
        const cc = new UserComment(copyData);
        cc.setDocId(this.docId);
        return cc;
    }
    // serialization
    serialize() {
        return {
            productName: this.productName,
            email: this.email,
            comment: this.comment,
            toc: this.toc,
        }
    }

}