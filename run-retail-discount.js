const readline = require('readline');
//const retail = require('./retail-discount');
const User = require('./retail-discount').User;
const Bill = require('./retail-discount').Bill;
const Item = require('./retail-discount').Item;

var input = "";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var userId, userType, registerDate;

const question1 = () => {
    return new Promise((resolve, reject) => {
      rl.question('User ID: ', (answer) => {
        userId = answer;
        resolve();
      })
    })
  }

  const question2 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Type (employee, affiliate, customer): ', (answer) => {
        userType = answer;
        resolve();
      })
    })
  }

  const question3 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Register Date (yyyy-mm-dd): ', (answer) => {
        registerDate = Date.parse(answer);
        resolve();
      })
    })
  }

  let lineItem = "";
  const questionItem = () => {
    return new Promise((resolve, reject) => {
      rl.question('', (answer) => {
        lineItem = answer;
        resolve();
      })
    })
  }


  let items = [];
  const question4 = () => {

    /*
    rl.on('line', (line) => {
        if(line.trim() === "")  {
            rl.close();

            let user = new new User(userId, userType, registerDate);
            let bill = new Bill(user, items);

            console.log(user);
            console.log("Items:");
            console.log(items);
            console.log(`Total Price: ${bill.totalPrice()}`);

            resolve();

        } else {
            let item = line.split("|");
            items.push(new Item(item[0], item[1], item[2]));
        }
    });
    */
  }

  const main = async () => {
    await question1();
    await question2();
    await question3();

    console.log(new Date(registerDate));

    console.log("Enter items in format: item|type|price, eg: Milk|grocery|18000");

    do {
        await questionItem();

        if(lineItem !== "" /*&& lineItem.trim() !== ""*/) {
            let item = lineItem.split("|");
            //console.log(lineItem);
            //console.log(new Item(item[0], item[1], parseInt(item[2])));
            items.push(new Item(item[0], new Date(item[1]), parseInt(item[2])));
            console.log("Item entered. Enter new items in format: item|type|price, eg: Milk|grocery|18000 or blank to stop");
        }

      } while (lineItem !== "" /*&& lineItem.trim() !== ""*/);

    rl.close();

    let user = new User(userId, userType, new Date(registerDate));
    console.log(user);
    let bill = new Bill(user, items);

    console.log(user);
    console.log("Items:");
    console.log(items);
    console.log(`Total Price: ${bill.totalPrice()}`);

}

main();

/*
rl.question('User ID: ', (answer) => {
    userId = answer;
    rl.resume();
  });
rl.pause();

rl.question('Type (employee, affiliate, customer): ', (answer) => {
    userType = answer;
    rl.resume();
  });
rl.pause();

rl.question('Register Date (yyyy-mm-dd): ', (answer) => {
    registerDate = Date.parse(answer);
    rl.resume();
  });
rl.pause();
*/
/*
console.log("Enter items in format: item|type|price, eg: Milk|grocery|18000");
let items = [];
rl.on('line', (line) => {
    if(line.trim() === "")  {
        rl.close();

        let user = new new User(userId, userType, registerDate);
        let bill = new Bill(user, items);

        console.log(user);
        console.log("Items:");
        console.log(items);
        console.log(`Total Price: ${bill.totalPrice()}`);

    } else {
        let item = line.split("|");
        items.push(new Item(item[0], item[1], item[2]));
    }
});

*/