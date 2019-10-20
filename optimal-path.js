module.exports = {
    optimalPath: function(vertices, edges, originVertex) {
        var nodeTable = new Map();
        var unvisited = [];
        var nextVisit = [ originVertex ];

        // construct nodeTable, set initial weight
        for(ii = 0; ii < vertices.length; ii++)
        {
            var vertexMatch = vertices[ii].match(/([A-Z]+)(\d+)/i);
            var vertex = vertexMatch[1];
            var weight = parseInt(vertexMatch[2]);
            nodeTable.set(vertex, { key: vertex, weight: weight, totalWeight: 0, previous: "", connection: [] });
            unvisited.push(vertex);
        }

        // update connections in nodeTable
        for(ii = 0; ii < edges.length; ii++)
        {
            var edge = edges[ii].split(/->/);
            var node = nodeTable.get(edge[0]);
            var newConnection = edge[1];
            console.log("edge: " +edge[0] +", " + node.connection)
            if (node.connection.includes(newConnection) || node.connection.includes(edge[0])){
                throw "Cycle detected: " + newConnection + " in: " + node.connection;
            } else {
                node.connection.push(newConnection);
            }
        }

        while(nextVisit.length > 0) {
            console.log("nextvisit: " + nextVisit)
            var visit = nextVisit.pop();
            console.log("visit: " + visit)
            //var idx = unvisited.findIndex((val) => { val === visit; });
            //console.log("idx: " + idx)
            //unvisited.splice(idx, 1);
            for(ii = 0; ii < unvisited.length; ii++) {
                if(unvisited[ii] === visit) {
                    unvisited.splice(ii, 1);
                    ii = unvisited.length;
                }
            }
            console.log("unvisited: " + unvisited)

            var node = nodeTable.get(visit);
            if(node.totalWeight < node.weight) {
                node.totalWeight = node.weight;
            }
            for(ii = 0; ii < node.connection.length; ii++) {
                var connection = node.connection[ii];
                var nodeConnection = nodeTable.get(connection);
                if(nodeConnection.totalWeight < node.totalWeight + nodeConnection.weight) {
                    nodeConnection.totalWeight = node.totalWeight + nodeConnection.weight;
                    if (node.previous !== "") {
                        nodeConnection.previous = node.previous + " -> " + visit;
                    } else {
                        nodeConnection.previous = visit;
                    }
                }

                if(unvisited.includes(connection)) {
                    nextVisit.push(connection);
                }
            }
        }

        var ret = [null, 0];
        nodeTable.forEach((value, key, map) => {
            if(value.totalWeight > ret[1]) {
                ret[0] = value.previous + " -> " + value.key;
                ret[1] = value.totalWeight;
            }
        });

        console.log(nodeTable);
        return ret;
    }
}