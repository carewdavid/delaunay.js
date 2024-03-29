"use strict";

class Triangle {
    constructor(p0, p1, p2) {
        this.vertexes = [p0, p1, p2];

        //Sort the vertexes counterclockwise for the circumcircle calculations
        this.vertexes.sort((a, b) => {
            return Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0]);
        })

    }

    isInCircumcircle(p) {

        const [x0, y0] = this.vertexes[0];
        const [x1, y1] = this.vertexes[1];
        const [x2, y2] = this.vertexes[2];
        //According to https://en.wikipedia.org/wiki/Delaunay_triangulation#Algorithms
        //this will determine if p is in the circumcircle of the triangle 
        const row0 = [x0 - p[0], y0 - p[1], Math.pow(x0 - p[0], 2) + Math.pow(y0 - p[1], 2)];
        const row1 = [x1 - p[0], y1 - p[1], Math.pow(x1 - p[0], 2) + Math.pow(y1 - p[1], 2)];
        const row2 = [x2 - p[0], y0 - p[1], Math.pow(x2 - p[0], 2) + Math.pow(y2 - p[1], 2)];

        const det = row0[0] * row1[1] * row2[2] +
              row0[1] * row1[2] * row2[0] +
              row0[2] * row1[0] * row2[1] -
              row0[2] * row1[1] * row2[0] -
              row0[1] * row1[0] * row2[2] -
              row0[0] * row1[2] * row2[1];
        return det > 0;
    }

    vertices() {
        return this.vertexes;
    }

    edges() {
        const [p0, p1, p2] = this.vertexes;
        return [[p0, p1], [p1, p2], [p2, p0]];
    }

    //True if the triangle contains the edge [p0, p1]
    hasEdge([p0, p1]) {
        for (let edge of this.edges()){
            const [start, end] = edge;

            //Comparing floats like this is a little icky, but we don't do any math so shouldn't have to worry about rounding issues throwing this off
            if(start === p0 && end === p1){
                return true;
            }
        }
        return false;
    }

    hasVertex([x, y]) {
        for(let point of this.vertexes){
            if(point[0] === x && point[1] === y){
                return true;
            }
        }
        return false;
    }
}

//Return a triangle enclosing all points
function makeSuperTriangle(points){
    //Find the outermost points
    let minX = points[0][0];
    let maxX = points[0][0];
    let minY = points[0][1];
    let maxY = points[0][1];

    for (let [x, y] of points) {
        if(x < minX){
            minX = x;
        }
        if(x > maxX){
            maxX = x;
        }
        if(y < minY){
            minY = y;
        }
        if(y > maxY){
            maxY = y;
        }
    }

    //Add some breathing room
    minX = 2 * minX - maxX;
    maxX = 2 * maxX - minX;
    minY = 2 * minY - maxY;
    maxY = 2 * maxY - minY;

    return [new Triangle([minX, minY], [minX, maxY], [maxX, minY]),
        new Triangle([minX, maxY], [maxX, maxY], [maxX, minY])];

}

function delaunay(points) {
    //Bowyer-Watson algorigthm
    let tris = [];
    const superTri = makeSuperTriangle(points)
    //It turns out to be easier to make two super triangles
    tris = tris.concat(superTri);
    console.log(`Created super triangles ${superTri[0]} and ${superTri[1]}.`);


    for (let point of points) {
        console.log(`Adding point ${point}.`);//debug
        let badTriangles = [];
        for (let tri of tris) {
            if(tri.isInCircumcircle(point)){
                badTriangles.push(tri);
            }
        }

        let polygon = [];
        for (let bad of badTriangles) {
            for (let edge of bad.edges()) {
                for (let tri of badTriangles)
                    if(tri != bad && tri.hasEdge(edge)){
                        polygon.push(edge);
                    }
            }
        }

        for (let tri of badTriangles) {
            //Remove all bad triangles
            const index = tris.indexOf(tri);
            tris.splice(index, 1);
        }

        for (let edge of polygon) {
            const [p0, p1] = edge;
            tris.push(new Triangle(p0, p1, point));
        }

    }

    for (let tri of tris) {
        for( let vertex of tri.vertices()){
            if(superTri[0].hasVertex(vertex)){
                const index = tris.indexOf(tri);
                tris.splice(index, -1);
            }
            if(superTri[1].hasVertex(vertex)){
                const index = tris.indexOf(tri);
                tris.splice(index, -1);
            }
        }
    }
    return tris;
}

module.exports = {delaunay, Triangle};
