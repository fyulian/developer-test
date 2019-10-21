const optimalpath = require('./optimal-path');
/* Test cases */
var vertices = ["A1","B2","C2"];
var edges = ["A->B", "B->C", "A->C"];
var originVertex = "A";

console.log("Scenario 1");
console.log ("Vertices: " + vertices);
console.log ("Edges: " + edges);
console.log ("Origin: " + originVertex);
ret = optimalpath.optimalPath(vertices, edges, originVertex);
console.log("Optimum path: " + ret[0] + ", with total weight: " + ret[1]);

console.log("");
console.log("Scenario 2");

var vertices = ["B2","C10","D2","A1","E5"];
var edges = ["A->B", "B->D", "A->C", "C->E", "D->E"];
var originVertex = "A";

console.log ("Vertices: " + vertices);
console.log ("Edges: " + edges);
console.log ("Origin: " + originVertex);
ret = optimalpath.optimalPath(vertices, edges, originVertex);
console.log("Optimum path: " + ret[0] + ", with total weight: " + ret[1]);

console.log("");
console.log("Scenario 3: Cyclic");
var vertices = ["A2","B3","C2","D1","E5"];
var edges = ["A->B", "B->C", "C->D", "D->E", "D->B", "A->D"];
//var edges = ["A->B", "B->C", "C->D", "D->E"];
var originVertex = "A";

console.log ("Vertices: " + vertices);
console.log ("Edges: " + edges);
console.log ("Origin: " + originVertex);
try {
    ret = optimalpath.optimalPath(vertices, edges, originVertex);
    console.log("Optimum path: " + ret[0].join(" -> ") + ", with total weight: " + ret[1]);
} catch(err ) {
    console.log("Failed: " + err);
}



