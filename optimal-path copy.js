/*
function checkCycle(nodeTable, currentVertex, checkVertex)
{
    var ret = checkVertex;
    var nextNode = nodeTable.get(currentVertex);

    while(nextNode[2] !== "" && nextNode[2] !== checkVertex) {
        nextVertex = nextNode[2];
        ret = nextVertex + " -> " + ret;
        nextNode = nodeTable.get(nextVertex);
    }

    if (nextNode[2] !== checkVertex)
    {
        return checkVertex + " -> " + ret;
    } else {
        return "";
    }

}
*/

function processNode(edges, nodeTable, currentVertex) {
//console.log("Processing: "+ currentVertex)
    for(ii = 0; ii < edges.length; ii++) {
        var edge = edges[ii].split(/->/);
        if(edge[0] == currentVertex) {
//console.log("found: " + edges[ii]);
            var currentNode = nodeTable.get(edge[0]);
            var connectedNode = nodeTable.get(edge[1]);
/*
            var cycle = checkCycle(nodeTable, currentVertex, edge[1]);
            console.log("cycle: " + currentVertex + " - " + edge[1] + " :" + cycle)
            if(cycle !== "") {
                throw "Cycle detected: " + cycle;
            }
*/
//console.log("currentNode: " + edge[0] + "; connectedNode: "+ edge[1]);
//console.log(currentNode);
//console.log(connectedNode);
                        // check total weight
            if(connectedNode[0] + currentNode[1] > connectedNode[1]) {
                // update node
//console.log("updating")
                connectedNode[1] = connectedNode[0] + currentNode[1];   // update total Weight
                connectedNode[2] = currentVertex;             // update previous node
                nodeTable.set(edge[1], connectedNode);
//console.log(nodeTable);
            }
        }
    }

}

module.exports = {
//    optimalPath: function(vertices, weights, edges, originVertex) {
    optimalPath: function(vertices, edges, originVertex) {
        var nodeTable = new Map();
        var unvisited = [];
        var currentVertex = null;

        // set initial values
        for(ii = 0; ii < vertices.length; ii++)
        {
            var vertexMatch = vertices[ii].match(/([A-Z]+)(\d+)/i);
            var vertex = vertexMatch[1];
            var weight = parseInt(vertexMatch[2]);
            // key: vertex, value: node weight, total weight, prevVertex

            if (vertex == originVertex) {
                // origin vertex, for first node
                nodeTable.set(vertex, [weight, weight, ""]);
                currentVertex = vertex;
            } else {
                nodeTable.set(vertex, [weight, 0, null])
                unvisited.pop(vertex);
            }
            /*
            if (vertices[ii] == originVertex) {
                // origin vertex, for first node
                nodeTable.set(vertices[ii], [weights[ii], weights[ii], ""]);
                currentVertex = vertices[ii];
            } else {
                nodeTable.set(vertices[ii], [weights[ii], 0, null])
                unvisited.push(vertices[ii]);
            }
            */
        }

//console.log("edges: ");
//console.log(edges);
//console.log("nodeTable: ");
//console.log(nodeTable);

        processNode(edges, nodeTable, currentVertex);
        while(unvisited.length > 0) {
//console.log("unvisited: " + unvisited);
            currentVertex = unvisited.push();
//console.log("processing unvisited: "+currentVertex);
            processNode(edges, nodeTable, currentVertex);
        }
//console.log("Final: ")
//console.log(nodeTable);


        // find max total weight
        var max = 0;
        var maxVertex=null;
        nodeTable.forEach((value, key, map) => {
            if(value[1] > max) {
                max = value[1];
                maxVertex = key;
            }
        });
//console.log("Max: " + max + "(" + maxVertex + ")");
        var nextVertex = maxVertex;
        var path = nextVertex;
        var nextNode = nodeTable.get(nextVertex);
//console.log("NextNode: " + nextNode);
        while(nextNode[2] !== "") {
            nextVertex = nextNode[2];
            path = nextVertex + " -> " + path;
            nextNode = nodeTable.get(nextVertex);
        }
        var ret = [max, path];
//console.log(ret);
        return ret;
    } 
}