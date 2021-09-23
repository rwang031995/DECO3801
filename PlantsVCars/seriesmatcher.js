// series-series matcher

const kdTree = require("./node_modules/k-d-tree/index.js");

console.log(kdTree)

us = [];
them = [];


for (i=0; i<1000000; i++){
    us.push({"type": "Point", "coordinates": [i, i]});
    if (i % 10 == 1){
        them.push({"type": "Point", "coordinates": [i+0.1, i+0.1]});
    }
}


function distance(a, b){
    return Math.hypot((a.coordinates[0] - b.coordinates[0])**2, (a.coordinates[1] - b.coordinates[1])**2);
}

// Calculate the area of the triangle 
// use points, not side length, to handle collinearity
function triangleAreaPoints(a, b, c){
    return 0.5 *  Math.abs(a[0]*(b[1] - c[1]) + b[0]*(c[1] - a[1]) + c[0]*(a[1] - b[1]));
}

function triangleMetric(self, tree){
    points = tree.nearest(self, 2);
    left = points[0][0].coordinates;
    right = points[1][0].coordinates;
    base = Math.sqrt((left[0] - right[0])**2 + (left[1] - right[1])**2);
    return triangleAreaPoints(self.coordinates, left, right)/base;
}

var them_tree = new kdTree(them, distance);
total = 0
for (i=0; i<us.length; i++){
    self = us[i];
    total += triangleMetric(self, them_tree)
//     console.log(self, rez)
}
console.log(total);