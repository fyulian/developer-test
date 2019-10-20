module.exports = {
    store: function(arr) {
        var text = "";
        // create the output lines for each item in the array
        arr.forEach((value, index) => {
            if(index > 0) {
                text = text.concat("\n");
            }

            // create the key value pair in a single line
            value.forEach((value, key, map) => {
                text = text.concat(`${key}=${value};`);
            })

            // remove the last semi colon from the line
            if(text.length > 0) {
                text = text.slice(0, -1);
            }
        })

        return text;
    }, 
    load: function(text) {
        var a = [];
        
        // split by lines ('\n')
        let lines = text.split("\n");
        lines.forEach((line, index) => {
            if(line.trim() !== "") {

                // split pair within line
                let values = line.split(";");
                values.forEach((value, idx) => {
                    if(value.trim() !== "") {

                        // split key value
                        keyValue = value.split("=");
                        if(keyValue.length !== 2) {
                            throw "Invalid key value format: " + value;
                        } else {
                            if(a.length < index + 1) {
                                a.push(new Map());
                            }
                            a[index].set(keyValue[0], keyValue[1])
                        }
                    }
                })
            }
        });

        return a;
    }
}
