class User {
    constructor(userId, userType, registerDate) {
        const validTypes = ["employee", "affiliate", "customer"];
        if (userId === "" || userId.trim() === "") {
            throw "User.userId may not be empty."
        }
        if(userType === "" || userType.trim() == "" || !validTypes.includes(userType.trim().toLowerCase())) {
            throw `Invalid type: ${userType}. Valid types: ${validTypes.join(",")}`;
        }
        /*
        if(typeof date.getMonth !== 'function') {
            throw `Invalid type for registerDate: ${registerDate}.`;
        }*/

        this._userId = userId;
        this._userType = userType;
        this._registerDate = registerDate;
    }

    get userId() {
        return this._userId;
    }

    get userType() {
        return this._userType;
    }

    get registerDate() {
        return this._registerDate;
    }

    discount() {
        let ret = 0.0;
        if (this.userType === "employee") {
            ret = 0.3;
        } else if (this.userType === "affiliate") {
            ret = 0.1;
        } else if (this.userType === "customer") {
            const thisYear = new Date().getFullYear();
            const thisMonth = new Date().getMonth();
            const registerYear = this.registerDate.getFullYear();
            const registerMonth = this.registerDate.getMonth();
            if (thisYear - registerYear > 2 ||
                (thisYear - registerYear == 2 && thisMonth > registerMonth)) {
                ret = 0.05;
            }
        }

        return ret;
    }
}

class Item {
    constructor(name, itemType, price) {
        if (name === ""/* || name.trim() === ""*/) {
            throw "Item.name may not be empty."
        }
        if (itemType === ""/* || itemType.trim() === ""*/) {
            throw "Item.itemType may not be empty."
        }
        if (typeof price !== "number"){
            throw "Item.price must be of number type."
        }
        this._name = name/*.trim()*/;
        this._itemType = itemType/*.trim()*/;
        this._price = price;
    }

    get name() {
        return this._name;
    }

    get itemType() {
        return this._itemType;
    }
    
    get price() {
        return this._price;
    }
    
}

class Bill {
    constructor(user, items) {
        console.log("constructor bill")
        this._user = user;
        this._items = items;
    }

    get user(){
        return this._user;
    }

    get items() {
        return this._items;
    }

    totalPrice() {
        console.log("total price");
        let afterDiscount = 1 - this._user.discount();
        let ret = 0.0;

        this._items.forEach((item) => {
            if (item.itemType/*.toLowerCase()*/ == "groceries") {
                ret += item.price;
            } else {
                ret += item.price * afterDiscount;
            }
        });

        let additionalDiscount = Math.floor(ret / 100) * 5;
        ret -= additionalDiscount;

        return ret;
    }
}

module.exports = {
    User,
    Bill, 
    Item    
}